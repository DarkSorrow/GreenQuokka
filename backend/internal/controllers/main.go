package controllers

import (
	"strings"
	"time"

	"aidanwoods.dev/go-paseto"
	"github.com/gocql/gocql"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
	"texky.com/server/internal/models"
	"texky.com/server/internal/services"
)

/*
** File contain basic structure and common handlers used for the server
** They could be considered is middleware
 */
type ApiHandler struct {
	DBSession    *gocql.Session
	DBManager    *models.DatabaseManager
	Log          *zap.Logger
	TokMana      *services.TokenManager
	QueryTimeout time.Duration
}

type AuthHandler struct {
	DBSession    *gocql.Session
	DBManager    *models.DatabaseManager
	Log          *zap.Logger
	PasswordsCfg []Password
	TokMana      *services.TokenManager
}

// Log the received request
func (h ApiHandler) LoggingRequest(ctx *fiber.Ctx) error {
	start := time.Now()

	ctx.Next()

	sub := fromLocal(ctx, "sub")
	lid := fromLocal(ctx, "lid")
	status := ctx.Response().StatusCode()
	novaID := ctx.Get("X-Nv-Id", "")
	if status < 500 {
		h.Log.Info("", zap.String("novaID", novaID),
			zap.String("sub", sub),
			zap.String("lid", lid),
			zap.ByteString("method", ctx.Context().Method()),
			zap.ByteString("url", ctx.Context().URI().RequestURI()),
			zap.Duration("rt", time.Since(start)/time.Millisecond),
			zap.Int("status", status),
		)
	} else {
		h.Log.Error("", zap.String("novaID", novaID),
			zap.String("sub", sub),
			zap.String("lid", lid),
			zap.ByteString("method", ctx.Context().Method()),
			zap.ByteString("url", ctx.Context().URI().RequestURI()),
			zap.Duration("rt", time.Since(start)/time.Millisecond),
			zap.Int("status", status),
		)
	}
	return nil
}

// Check if the query token is valid
func (h ApiHandler) AuthentifyRequest(ctx *fiber.Ctx) error {
	token := ctx.Cookies("sid", "")
	headerToken := ctx.Get("X-Nv-Token", "")
	if token == "" || headerToken == "" {
		h.Log.Warn("authorized-empty", zap.String("ip", ctx.IP()), zap.String("h-token", headerToken), zap.String("c-token", token))
		return ctx.Status(403).JSON(fiber.Map{"error": "NotAuthorized"})
	}
	parser := paseto.NewParser()
	parsedToken, errToken := parser.ParseV4Local(h.TokMana.Pas.SecretKey, token, nil)
	if errToken != nil {
		h.Log.Warn("authorized-error", zap.String("ip", ctx.IP()), zap.Error(errToken))
		return ctx.Status(403).JSON(fiber.Map{"error": "NotAuthorized"})
	}
	sub, errSub := parsedToken.GetSubject()
	if errSub != nil {
		h.Log.Warn("authorized-decode", zap.String("id", "sub"), zap.String("ip", ctx.IP()), zap.Error(errSub))
		return ctx.Status(403).JSON(fiber.Map{"error": "NotAuthorized"})
	}
	groups, errLid := parsedToken.GetString(headerToken)
	if errLid != nil {
		h.Log.Warn("authorized-decode", zap.String("id", "sub"), zap.String("ip", ctx.IP()), zap.Error(errLid))
		return ctx.Status(403).JSON(fiber.Map{"error": "NotAuthorized"})
	}
	ctx.Locals("lid", headerToken)
	ctx.Locals("groups", groups)
	ctx.Locals("sub", sub)
	ctx.Next()
	return nil
}

func (h ApiHandler) RenewUser(ctx *fiber.Ctx) error {
	token := paseto.NewToken()
	currentTime := time.Now()
	expiration := currentTime.Add(3 * time.Hour)
	subject := ctx.Locals("sub").(string)
	token.SetIssuer("nv-id")
	token.SetIssuedAt(currentTime)
	token.SetNotBefore(currentTime)
	token.SetExpiration(expiration)
	token.SetSubject(subject)
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
		token.SetString(legal.String(), strings.Join(groups, ":"))
	}
	if err := scanner.Err(); err != nil {
		h.Log.Error("login", zap.Error(err))
		return ctx.Status(500).JSON(fiber.Map{"error": "InternalError"})
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

	ctx.Cookie(cookie)
	return ctx.JSON(fiber.Map{"exp": expiration.UTC().String()})
}
