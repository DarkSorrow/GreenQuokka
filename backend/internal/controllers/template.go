package controllers

import (
	"context"
	"net/url"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
	"texky.com/server/internal/models"
)

// counter for consistency
func (h ApiHandler) GetTemplates(ctx *fiber.Ctx) error {
	lid := fromLocal(ctx, "lid")
	topic := ctx.Params("topic", "")
	queryStruct := h.DBManager.GetContextPage(ctx)
	defer queryStruct.Cancel()
	templates, options, err := h.DBManager.QueryTemplates(queryStruct, &topic, &lid)
	if err != nil {
		h.Log.Error("list-templates", zap.Error(err), zap.String("nvID", ctx.Get("X-Nv-Id", "")))
		return ctx.Status(500).JSON(fiber.Map{"error": "InternalError"})
	}
	return ctx.JSON(fiber.Map{"status": 1, "data": templates, "options": options})
}

func (h ApiHandler) GetTemplate(ctx *fiber.Ctx) error {
	lid := fromLocal(ctx, "lid")
	encodedTopic := ctx.Params("topic", "")
	encodedSubject := ctx.Params("subject", "")
	if encodedSubject == "" || encodedTopic == "" {
		return ctx.Status(400).JSON(fiber.Map{"error": "NoMatch"})
	}
	subject, decErr := url.QueryUnescape(encodedSubject)
	if decErr != nil {
		h.Log.Error("get-template", zap.Error(decErr), zap.String("nvID", ctx.Get("X-Nv-Id", "")))
		return ctx.Status(500).JSON(fiber.Map{"error": "InternalError"})
	}
	topic, decErr := url.QueryUnescape(encodedTopic)
	if decErr != nil {
		h.Log.Error("get-template", zap.Error(decErr), zap.String("nvID", ctx.Get("X-Nv-Id", "")))
		return ctx.Status(500).JSON(fiber.Map{"error": "InternalError"})
	}
	queryStruct := h.DBManager.GetContextPage(ctx)
	defer queryStruct.Cancel()
	template, err := h.DBManager.QueryTemplate(queryStruct, &lid, &topic, &subject)
	if err != nil {
		h.Log.Error("sel-template", zap.Error(err), zap.String("topic", topic), zap.String("subject", subject), zap.String("nvID", ctx.Get("X-Nv-Id", "")))
		return ctx.Status(404).JSON(fiber.Map{"error": "NoMatch"})
	}
	return ctx.JSON(fiber.Map{"status": 1, "data": template})
}

func (h ApiHandler) RemoveTemplate(ctx *fiber.Ctx) error {
	lid := fromLocal(ctx, "lid")
	topic := ctx.Params("topic", "")
	if _, ok := models.TemplateTopics[topic]; !ok {
		return ctx.Status(400).JSON(fiber.Map{"error": "Topic or Subject not found"})
	}
	subject := ctx.Params("subject", "")
	vers := ctx.Params("version", "")
	if subject == "" || topic == "" || vers == "" {
		return ctx.Status(400).JSON(fiber.Map{"error": "NoMatch"})
	}

	version, err := strconv.Atoi(vers)
	if err != nil {
		h.Log.Error("del-template", zap.Error(err), zap.String("nvID", ctx.Get("X-Nv-Id", "")))
		return ctx.Status(404).JSON(fiber.Map{"error": "Convert"})
	}
	qCtx, cancel := context.WithTimeout(ctx.Context(), h.QueryTimeout)
	defer cancel()

	if err := h.DBManager.Cassandra.Query(
		"DELETE FROM templates WHERE legal_id = ? AND topic = ? AND subject = ? AND version = ?",
		lid, topic, subject, version,
	).WithContext(qCtx).Exec(); err != nil {
		h.Log.Error("del-template", zap.Error(err), zap.String("nvID", ctx.Get("X-Nv-Id", "")))
		return ctx.Status(404).JSON(fiber.Map{"error": "NoMatch"})
	}
	return ctx.JSON(fiber.Map{"status": 1, "errors": nil})
}

func (h ApiHandler) UpsertTemplate(ctx *fiber.Ctx) error {
	lid := fromLocal(ctx, "lid")
	subjectID := fromLocal(ctx, "sub")

	template := new(models.Template)
	if err := ctx.BodyParser(&template); err != nil {
		h.Log.Error("post-template", zap.String("part", "body-parse"), zap.Error(err), zap.String("ip", ctx.IP()), zap.String("nvID", ctx.Get("X-Nv-Id", "")))
		return ctx.Status(500).JSON(fiber.Map{"error": "InternalError"})
	}

	if template.Subject == "" {
		return ctx.Status(400).JSON(fiber.Map{"error": "Topic or Subject not found"})
	}

	queryStruct := h.DBManager.GetContextPage(ctx)
	defer queryStruct.Cancel()

	exist, errExist := h.DBManager.QueryIsNewTemplate(queryStruct, &lid, template)
	if errExist != nil {
		h.Log.Error("post-template", zap.String("part", "exist"), zap.Error(errExist), zap.String("ip", ctx.IP()), zap.String("nvID", ctx.Get("X-Nv-Id", "")))
		return ctx.Status(500).JSON(fiber.Map{"error": "InternalError"})
	}

	if !exist {
		if err := h.DBManager.Cassandra.Query(
			"INSERT INTO templates (legal_id,topic,subject,version,created_at) VALUES (?,?,?,?,?);",
			lid,
			template.Topic,
			template.Subject,
			template.Version,
			time.Now(),
		).WithContext(queryStruct.QCtx).Exec(); err != nil {
			h.Log.Error("add-template", zap.Error(err), zap.String("nvID", ctx.Get("X-Nv-Id", "")))
			return ctx.Status(404).JSON(fiber.Map{"error": "NoMatch"})
		}
	}

	if err := h.DBManager.Cassandra.Query(
		"INSERT INTO templates (legal_id,topic,subject,version,description,format,active,schema_body,schema_rights,contracts,updated_at,updated_by) VALUES (?,?,?,?,?,?,?,?,?,?,?,?);",
		lid,
		template.Topic,
		template.Subject,
		template.Version,
		template.Description,
		template.Format,
		template.Active,
		template.SchemaBody,
		template.SchemaRights,
		template.Contracts,
		time.Now(),
		subjectID,
	).WithContext(queryStruct.QCtx).Exec(); err != nil {
		h.Log.Error("add-template", zap.Error(err), zap.String("nvID", ctx.Get("X-Nv-Id", "")))
		return ctx.Status(404).JSON(fiber.Map{"error": "NoMatch"})
	}
	return ctx.JSON(fiber.Map{"status": 1, "errors": nil})
}
