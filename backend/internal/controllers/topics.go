package controllers

import (
	"context"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
	"texky.com/server/internal/models"
)

// counter for consistency
func (h ApiHandler) GetTopics(ctx *fiber.Ctx) error {
	lid := fromLocal(ctx, "lid")
	queryStruct := h.DBManager.GetContextPage(ctx)
	defer queryStruct.Cancel()
	templates, options, err := h.DBManager.QueryTopic(queryStruct, &lid)
	if err != nil {
		h.Log.Error("list-topics", zap.Error(err), zap.String("nvID", ctx.Get("X-Nv-Id", "")))
		return ctx.Status(500).JSON(fiber.Map{"error": "InternalError"})
	}
	return ctx.JSON(fiber.Map{"status": 1, "data": templates, "options": options})
}

func (h ApiHandler) RemoveTopic(ctx *fiber.Ctx) error {
	lid := fromLocal(ctx, "lid")
	topic := ctx.Params("topic", "")
	if topic == "" {
		return ctx.Status(400).JSON(fiber.Map{"error": "Topic not found"})
	}
	qCtx, cancel := context.WithTimeout(ctx.Context(), h.QueryTimeout)
	defer cancel()
	if err := h.DBManager.Cassandra.Query(
		"DELETE FROM topics_count WHERE legal_id = ? AND topic = ?",
		lid, topic,
	).WithContext(qCtx).Exec(); err != nil {
		h.Log.Error("del-template", zap.Error(err), zap.String("nvID", ctx.Get("X-Nv-Id", "")))
		return ctx.Status(404).JSON(fiber.Map{"error": "NoMatch"})
	}
	return ctx.JSON(fiber.Map{"status": 1, "errors": nil})
}

func (h ApiHandler) UpsertTopic(ctx *fiber.Ctx) error {
	lid := fromLocal(ctx, "lid")
	topics := new(models.Topic)
	if err := ctx.BodyParser(&topics); err != nil {
		h.Log.Error("post-topic", zap.String("part", "body-parse"), zap.Error(err), zap.String("ip", ctx.IP()), zap.String("nvID", ctx.Get("X-Nv-Id", "")))
		return ctx.Status(500).JSON(fiber.Map{"error": "InternalError"})
	}
	if topics.Topics == "" {
		return ctx.Status(400).JSON(fiber.Map{"error": "Topic not found"})
	}
	queryStruct := h.DBManager.GetContextPage(ctx)
	defer queryStruct.Cancel()
	if err := h.DBManager.Cassandra.Query(
		"UPDATE topics_count SET count = count + 0 WHERE legal_id = ? AND topics = ?;",
		lid,
		topics.Topics,
	).WithContext(queryStruct.QCtx).Exec(); err != nil {
		h.Log.Error("add-topic", zap.Error(err), zap.String("nvID", ctx.Get("X-Nv-Id", "")))
		return ctx.Status(404).JSON(fiber.Map{"error": "NoMatch"})
	}
	return ctx.JSON(fiber.Map{"status": 1, "errors": nil})
}
