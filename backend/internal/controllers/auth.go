package controllers

import (
	"crypto/rand"
	"crypto/subtle"
	"hash"
	"net/mail"
	"net/url"
	"os"
	"strings"
	"time"

	"aidanwoods.dev/go-paseto"
	"github.com/gocql/gocql"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
	"golang.org/x/crypto/pbkdf2"
)

type Password struct {
	Iteration  int
	SaltLength int
	KeyLength  int
	CryptoHash func() hash.Hash
}

// Define the Person struct
type UserLogin struct {
	Email    string `json:"email"`
	Password string `json:"pwd"`
}

type UserRegister struct {
	Email    string `json:"email"`
	Password string `json:"pwd"`
	Country  string `json:"country"`
	Terms    bool   `json:"terms"`
}

type EntityGroup struct {
	DisplayName string
	Preferences map[string]string
	Groups      []string
}

func generateRandomSalt(saltSize int) ([]byte, error) {
	var salt = make([]byte, saltSize)
	_, err := rand.Read(salt[:])
	return salt, err
}

func (h AuthHandler) LoginUser(ctx *fiber.Ctx) error {
	token := paseto.NewToken()
	currentTime := time.Now()
	expiration := currentTime.Add(3 * time.Hour)
	token.SetIssuer("nv-id")
	token.SetIssuedAt(currentTime)
	token.SetNotBefore(currentTime)
	token.SetExpiration(expiration)
	token.SetSubject(ctx.Locals("sub").(string))
	entitiesGroup := ctx.Locals("entities").(map[string]EntityGroup)
	for legalID, entity := range entitiesGroup {
		token.SetString(legalID, strings.Join(entity.Groups, ":"))
	}

	signed := token.V4Encrypt(h.TokMana.Pas.SecretKey, nil)
	cookie := new(fiber.Cookie)
	cookie.Name = "sid"
	cookie.Value = signed
	cookie.Expires = time.Now().Add(3 * time.Hour)
	cookie.SameSite = "Strict"
	cookie.HTTPOnly = true
	cookie.Secure = true
	cookie.Path = "/api"

	//https://docs.gofiber.io/api/ctx#cookie
	ctx.Cookie(cookie)
	return ctx.JSON(fiber.Map{"entities": entitiesGroup, "exp": expiration.UTC().String()})
}

// Signup create a new account for the user
func (h AuthHandler) AuthSignup(ctx *fiber.Ctx) error {
	userSignup := new(UserRegister)
	if err := ctx.BodyParser(userSignup); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "WrongRequest"})
	}
	userSignup.Terms = true
	if _, exist := CountriesList[userSignup.Country]; !exist {
		h.Log.Error("signup", zap.String("part", "country"), zap.String("ip", ctx.IP()), zap.String("nvID", ctx.Get("X-Nv-Id", "")))
		return ctx.Status(400).JSON(fiber.Map{"error": "WrongRequest"})
	}
	pwdSize := len(userSignup.Password)
	if pwdSize <= 7 || pwdSize >= 34 {
		h.Log.Error("signup", zap.Int("pwdSize", pwdSize), zap.String("ip", ctx.IP()), zap.String("nvID", ctx.Get("X-Nv-Id", "")))
		return ctx.Status(400).JSON(fiber.Map{"error": "PwdLength"})
	}
	emailAddr, err := mail.ParseAddress(strings.ToLower(userSignup.Email))
	if err != nil {
		h.Log.Panic("signup", zap.String("part", "mail"), zap.Error(err))
		return ctx.Status(400).JSON(fiber.Map{"error": "EmailFormat"})
	}

	encType := 0
	salt, errSalt := generateRandomSalt(h.PasswordsCfg[encType].SaltLength)
	if errSalt != nil {
		h.Log.Panic("signup", zap.String("part", "salt"), zap.Error(errSalt), zap.String("nvID", ctx.Get("X-Nv-Id", "")))
		os.Exit(1)
	}
	encPwd := pbkdf2.Key([]byte(userSignup.Password), salt, h.PasswordsCfg[encType].Iteration, h.PasswordsCfg[encType].KeyLength, h.PasswordsCfg[encType].CryptoHash)

	currentTime := time.Now()
	m := make(map[string]interface{})
	subject := gocql.TimeUUID()
	applied, errInsert := h.DBManager.Cassandra.Query("INSERT INTO login (email, subject, email_verified, mfa_type, suspended, updated_at, last_login, enc_type, salt, password) VALUES (?,?,?,?,?,?,?,?,?,?) IF NOT EXISTS;",
		emailAddr.Address, subject, false, 0, false, currentTime, currentTime, encType, salt, encPwd).MapScanCAS(m)
	if errInsert != nil {
		h.Log.Error("signup", zap.String("email", emailAddr.Address), zap.String("ip", ctx.IP()), zap.Error(errInsert), zap.String("nvID", ctx.Get("X-Nv-Id", "")))
		return ctx.Status(500).JSON(fiber.Map{"error": "NoCreationAccount"})
	}

	if !applied {
		subject = m["subject"].(gocql.UUID)
		h.Log.Error("signup", zap.String("part", "applied"), zap.String("subject", subject.String()), zap.String("ip", ctx.IP()), zap.String("nvID", ctx.Get("X-Nv-Id", "")))
		return ctx.Status(404).JSON(fiber.Map{"error": "AccountExist"})
	}

	if err := h.DBManager.Cassandra.Query("INSERT INTO subject_email (subject, email) VALUES (?,?);",
		subject, emailAddr.Address).Exec(); err != nil {
		h.Log.Error("signup", zap.String("part", "subject"), zap.Error(err), zap.String("ip", ctx.IP()), zap.String("nvID", ctx.Get("X-Nv-Id", "")))
		return ctx.Status(500).JSON(fiber.Map{"error": "NoCreationAccount"})
	}
	// We check if that user has some pending inviation to be part of a company

	scanner := h.DBManager.Cassandra.Query("SELECT legal_id,display_name,groups,updated_by FROM legal_pending WHERE email = ?", emailAddr.Address).Iter().Scanner()
	found := false
	entitiesGroup := make(map[string]EntityGroup)
	for scanner.Next() {
		var (
			legal       gocql.UUID
			group       string
			displayName string
			updatedBy   gocql.UUID
		)
		err := scanner.Scan(&legal, &displayName, &group, &updatedBy)
		if err != nil {
			h.Log.Error("signup", zap.String("part", "exist-legal"), zap.Error(err))
			return ctx.Status(500).JSON(fiber.Map{"error": "InternalError"})
		}
		legalID := legal.String()
		tmp, exist := entitiesGroup[legalID]
		if exist {
			tmp.Groups = append(tmp.Groups, group)
			entitiesGroup[legalID] = tmp
		} else {
			entitiesGroup[legalID] = EntityGroup{
				DisplayName: displayName,
				Groups:      []string{group},
			}
		}
		if err := h.DBManager.Cassandra.Query("INSERT INTO legal_groups (legal_id,subject,display_name,groups,updated_at,updated_by) VALUES (?,?,?,?,?,?)",
			legal, subject, displayName, group, currentTime, updatedBy).Exec(); err != nil {
			h.Log.Error("signup", zap.String("part", "exist-legal-group"), zap.Error(err), zap.String("ip", ctx.IP()), zap.String("nvID", ctx.Get("X-Nv-Id", "")))
			return ctx.Status(500).JSON(fiber.Map{"error": "AccountCreatedError"})
		}
		found = true
	}

	if found {
		for legalID, entity := range entitiesGroup {
			if err := h.DBManager.Cassandra.Query("INSERT INTO subject_groups (subject,legal_id,display_name,groups) VALUES (?,?,?,?);",
				subject, legalID, entity.DisplayName, entity.Groups).Exec(); err != nil {
				h.Log.Error("signup", zap.String("part", "exist-legal-subject"), zap.Error(err), zap.String("ip", ctx.IP()), zap.String("nvID", ctx.Get("X-Nv-Id", "")))
				return ctx.Status(500).JSON(fiber.Map{"error": "AccountCreatedError"})
			}
		}
		if err := h.DBManager.Cassandra.Query("DELETE FROM legal_pending WHERE email = ?", emailAddr.Address).Exec(); err != nil {
			h.Log.Error("signup", zap.String("part", "exist-legal-delete"), zap.Error(err), zap.String("ip", ctx.IP()), zap.String("nvID", ctx.Get("X-Nv-Id", "")))
			return ctx.Status(500).JSON(fiber.Map{"error": "AccountCreatedError"})
		}
	} else {
		legal := gocql.TimeUUID()
		legalID := legal.String()
		entitiesGroup[legalID] = EntityGroup{
			DisplayName: "new",
			Groups:      []string{"creator"},
		}
		// create a new company for the user,  the shards is round(2022 / 1000)
		if err := h.DBManager.Cassandra.Query(
			"INSERT INTO legal_entity (id,creator,shards,country,name,email,phone,additional_address,city,postal_code,region,street_address,phone_country,updated_at,updated_by) VALUES (?,?,?,?,'',?,'','','','','','','',?,?);",
			legal, subject, "20" /*strconv.Itoa(currentTime.Year())*/, userSignup.Country, userSignup.Email, currentTime, subject).Exec(); err != nil {
			h.Log.Error("signup", zap.String("part", "create-legal"), zap.Error(err), zap.String("ip", ctx.IP()), zap.String("nvID", ctx.Get("X-Nv-Id", "")))
			return ctx.Status(500).JSON(fiber.Map{"error": "AccountCreatedError"})
		}
		if err := h.DBManager.Cassandra.Query("INSERT INTO subject_groups (subject,legal_id,display_name,groups) VALUES (?,?,?,?);",
			subject, legal, entitiesGroup[legalID].DisplayName, entitiesGroup[legalID].Groups).Exec(); err != nil {
			h.Log.Error("signup", zap.String("part", "exist-legal-subject"), zap.Error(err), zap.String("ip", ctx.IP()), zap.String("nvID", ctx.Get("X-Nv-Id", "")))
			return ctx.Status(500).JSON(fiber.Map{"error": "AccountCreatedError"})
		}
		if err := h.DBManager.Cassandra.Query("INSERT INTO legal_groups (legal_id,subject,display_name,groups,updated_at,updated_by) VALUES (?,?,?,'creator',?,?);",
			legalID, subject, entitiesGroup[legalID].DisplayName, currentTime, subject).Exec(); err != nil {
			h.Log.Error("signup", zap.String("part", "exist-legal-group"), zap.Error(err), zap.String("ip", ctx.IP()), zap.String("nvID", ctx.Get("X-Nv-Id", "")))
			return ctx.Status(500).JSON(fiber.Map{"error": "AccountCreatedError"})
		}
	}
	// First sign up we create a line for the person company in our database?
	ctx.Locals("entities", entitiesGroup)
	ctx.Locals("sub", subject.String())
	return ctx.Next()
}

// Signin sign the user with his email address
func (h AuthHandler) AuthSignin(ctx *fiber.Ctx) error {
	userLogin := new(UserLogin)
	if err := ctx.BodyParser(userLogin); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "WrongRequest"})
	}
	pwdSize := len(userLogin.Password)
	if pwdSize <= 7 || pwdSize >= 34 {
		return ctx.Status(400).JSON(fiber.Map{"error": "NoMatch"})
	}
	emailAddr := strings.ToLower(userLogin.Email)
	var password []byte
	var salt []byte
	var subject gocql.UUID
	var suspended bool
	var encType int16
	if err := h.DBManager.Cassandra.Query("SELECT enc_type,password,salt,subject,suspended FROM login WHERE email = ?",
		emailAddr).Scan(&encType, &password, &salt, &subject, &suspended); err != nil {
		h.Log.Error("login", zap.String("email", userLogin.Email), zap.String("ip", ctx.IP()), zap.String("nvID", ctx.Get("X-Nv-Id", "")))
		return ctx.Status(404).JSON(fiber.Map{"error": "NoMatch"})
	}

	if suspended {
		return ctx.Status(400).JSON(fiber.Map{"error": "Suspended"})
	}

	encPwd := pbkdf2.Key([]byte(userLogin.Password), salt, h.PasswordsCfg[encType].Iteration, h.PasswordsCfg[encType].KeyLength, h.PasswordsCfg[encType].CryptoHash)
	if subtle.ConstantTimeCompare(encPwd, password) != 1 {
		h.Log.Error("login", zap.String("email", userLogin.Email), zap.String("ip", ctx.IP()), zap.String("nvID", ctx.Get("X-Nv-Id", "")))
		return ctx.Status(404).JSON(fiber.Map{"error": "NoMatch"})
	}

	if err := h.DBManager.Cassandra.Query(
		"INSERT INTO login (email,last_login) VALUES (?,?);",
		emailAddr,
		time.Now(),
	).Consistency(gocql.LocalOne).Exec(); err != nil {
		h.Log.Error("login-emp", zap.Error(err), zap.String("nvID", ctx.Get("X-Nv-Id", "")))
		return ctx.Status(404).JSON(fiber.Map{"error": "NoMatch"})
	}
	entitiesGroup := make(map[string]EntityGroup)
	scanner := h.DBManager.Cassandra.Query("SELECT legal_id,display_name,pref,groups FROM subject_groups WHERE subject = ?", subject).Iter().Scanner()
	for scanner.Next() {
		var (
			legal       gocql.UUID
			displayName string
			preferences map[string]string
			groups      []string
		)
		err := scanner.Scan(&legal, &displayName, &preferences, &groups)
		if err != nil {
			h.Log.Error("login", zap.Error(err))
			return ctx.Status(500).JSON(fiber.Map{"error": "InternalError"})
		}
		entitiesGroup[legal.String()] = EntityGroup{
			DisplayName: displayName,
			Preferences: preferences,
			Groups:      groups,
		}
	}
	if err := scanner.Err(); err != nil {
		h.Log.Error("login", zap.Error(err))
		return ctx.Status(500).JSON(fiber.Map{"error": "InternalError"})
	}

	ctx.Locals("entities", entitiesGroup)
	ctx.Locals("sub", subject.String())
	return ctx.Next()
}

// Signin sign the user with his email address
func (h AuthHandler) AuthCBSocial(ctx *fiber.Ctx) error {
	h.Log.Debug("Social", zap.String("param", ctx.Params("social")))
	return ctx.JSON(fiber.Map{"data": ctx.Params("social")})
}

func (h AuthHandler) LogoutUser(ctx *fiber.Ctx) error {
	//https://docs.gofiber.io/api/ctx#cookie
	ctx.ClearCookie("sid")
	return ctx.JSON(fiber.Map{"s": true})
}

//https://developers.facebook.com/docs/facebook-login/guides/advanced/manual-flow/
func (h AuthHandler) GetForms(ctx *fiber.Ctx) error {
	lid := ctx.Params("entity", "")
	topic := ctx.Params("topic", "")
	name := ctx.Params("name", "")
	version := ctx.Params("version", "")
	queryStruct := h.DBManager.GetContextPage(ctx)
	defer queryStruct.Cancel()
	decoded, decErr := url.QueryUnescape(name)
	if decErr != nil {
		h.Log.Error("get-forms", zap.Error(decErr), zap.String("nvID", ctx.Get("X-Nv-Id", "")))
		return ctx.Status(500).JSON(fiber.Map{"error": "InternalError"})
	}
	decodedTopic, decErr := url.QueryUnescape(topic)
	if decErr != nil {
		h.Log.Error("get-forms", zap.Error(decErr), zap.String("nvID", ctx.Get("X-Nv-Id", "")))
		return ctx.Status(500).JSON(fiber.Map{"error": "InternalError"})
	}
	templates, err := h.DBManager.QueryForm(queryStruct, &lid, &decodedTopic, &decoded, &version)
	if err != nil {
		h.Log.Error("get-forms", zap.Error(err), zap.String("nvID", ctx.Get("X-Nv-Id", "")))
		return ctx.Status(500).JSON(fiber.Map{"error": "InternalError"})
	}
	return ctx.JSON(fiber.Map{"status": 1, "form": templates})
}
