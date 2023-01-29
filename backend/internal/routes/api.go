package routes

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
	"texky.com/server/internal/controllers"
	"texky.com/server/internal/models"
	"texky.com/server/internal/services"
)

func Api(app *fiber.App, logger *zap.Logger, tokenManager *services.TokenManager, dbManager *models.DatabaseManager) {
	h := &controllers.ApiHandler{
		DBManager:    dbManager,
		Log:          logger,
		TokMana:      tokenManager,
		QueryTimeout: 30 * time.Second,
	}
	r := app.Group("/api/v1")
	r.Use(h.LoggingRequest)
	r.Use(h.AuthentifyRequest)

	r.Get("/topic", h.GetTopics)
	r.Delete("/topic/:topic", h.RemoveTopic)
	r.Post("/topic", h.UpsertTopic)

	// Templates management
	r.Get("/templates/:topic", h.GetTemplates)
	r.Get("/template/:topic/:subject", h.GetTemplate)
	r.Delete("/template/:topic/:subject/:version", h.RemoveTemplate)
	r.Post("/template", h.UpsertTemplate)

	//r.Get("/log/renew", h.RenewUser)
	// Legal entity management
	//r.Get("/entity", h.GetLegal)
	//r.Post("/entity/locale", h.UpsertLegalLocale) // should create a new element but will also do a insert or update

	// Schema management
	//r.Get("/employees", h.GetSchemas)
	//r.Get("/employee/:employeeID", h.GetSchema)
	//r.Delete("/employee/:employeeID", h.RemoveSchema)
	//r.Post("/employee", h.UpsertSchema)

}
