package main

import (
	"os"
	"os/signal"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
	"texky.com/server/internal/models"
	"texky.com/server/internal/routes"
	"texky.com/server/internal/services"
)

func main() {
	session := services.CassandraSession()
	defer session.Close()
	logger := services.NewLogger("go-api", "Debug")
	defer logger.Sync()
	app := fiber.New()

	tokenManager := services.NewTokenManager()
	dbManager := models.NewDbManager(logger, session)
	// Login routes
	routes.Priv(app, logger, tokenManager, dbManager)
	// Api routes
	routes.Api(app, logger, tokenManager, dbManager)

	// Create graceful shutdown for the server
	exitNotif := make(chan os.Signal, 1)
	signal.Notify(exitNotif, os.Interrupt)

	serverShutdown := make(chan struct{})

	go func() {
		<-exitNotif
		logger.Warn("App-Shutdown")
		_ = app.Shutdown()
		serverShutdown <- struct{}{}
	}()

	if err := app.Listen(":8000"); err != nil {
		logger.Panic("List error", zap.Error(err))
	}

	select {
	case <-serverShutdown:
		logger.Warn("App-Exit", zap.String("detail", "Graceful shutting completed, exiting..."))
		os.Exit(0)
	case <-time.After(2 * time.Second):
		logger.Error("App-Exit", zap.String("detail", " Graceful shutting down timed out, forcing shut down..."))
		os.Exit(1)
	}
}
