package routes

import (
	"crypto/sha512"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
	"texky.com/server/internal/controllers"
	"texky.com/server/internal/models"
	"texky.com/server/internal/services"
)

func Priv(app *fiber.App, logger *zap.Logger, tokenManager *services.TokenManager, dbManager *models.DatabaseManager) {
	h := &controllers.AuthHandler{
		Log:       logger,
		TokMana:   tokenManager,
		DBManager: dbManager,
		PasswordsCfg: []controllers.Password{
			{
				Iteration:  100142,
				SaltLength: 32,
				KeyLength:  64,
				CryptoHash: sha512.New,
			},
		},
	}

	// h.Log.Debug("legal-local-query", zap.String("key", h.TokMana.Pas.SecretKey.ExportHex()))
	r := app.Group("/Priv")
	r.Get("/logout", h.LogoutUser)
	r.Post("/signin", h.AuthSignin, h.LoginUser)
	r.Post("/signup", h.AuthSignup, h.LoginUser)
	r.Get("/socb/:social", h.AuthCBSocial, h.LoginUser) // social login callback

	r.Get("/forms/:entity/:topic/:name/:version", h.GetForms)
}
