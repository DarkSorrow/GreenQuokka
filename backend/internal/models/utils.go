package models

import (
	"context"
	"encoding/base64"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

var (
	ETableName string = "employee"
	STableName string = "supplier"
	RTableName string = "resource"
	CTableName string = "client"
	ATableName string = "article"
	TTableName string = "template"
)

// Get the pageOption object to return
func getPageOption(cursor []byte, numRows int) *PageOptions {
	page := ""
	if len(cursor) > 0 {
		page = base64.RawURLEncoding.EncodeToString(cursor)
	}
	return &PageOptions{
		Number: numRows,
		PageID: page,
	}
}

// Get the cursor and page size that will be used in cassandra
func (db DatabaseManager) GetContextPage(ctx *fiber.Ctx) *QueryContext {
	sizeStr := ctx.Query("psize", "")
	cursorStr := ctx.Query("pcursor", "")
	qCtx, cancel := context.WithTimeout(ctx.Context(), db.QueryTimeout)
	size := 50
	if sizeStr != "" {
		i, err := strconv.Atoi(sizeStr)
		if err != nil {
			db.Log.Error("pageParse", zap.Error(err), zap.String("nvID", ctx.Get("X-Nv-Id", "")))
		}
		if i <= 100 {
			size = i
		}
	}
	queryContext := QueryContext{
		QCtx:   qCtx,
		Cancel: cancel,
		Size:   size,
	}
	if cursorStr != "" {
		var err error
		if queryContext.Cursor, err = base64.RawURLEncoding.DecodeString(cursorStr); err != nil {
			db.Log.Error("pageParse", zap.Error(err), zap.String("nvID", ctx.Get("X-Nv-Id", "")))
		}
	}
	return &queryContext
}

// If the value is null, the function will return a default specified value
func cassandraDefault[T any](value *T, def T) T {
	if value != nil {
		return *value
	}
	return def
}
