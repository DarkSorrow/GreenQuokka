package models

import (
	"context"
	"time"

	"github.com/gocql/gocql"
	"go.uber.org/zap"
)

type DatabaseManager struct {
	Cassandra    *gocql.Session
	Log          *zap.Logger
	QueryTimeout time.Duration
}

type PageOptions struct {
	Number int    `json:"num"`
	PageID string `json:"pageID"`
}

type QueryContext struct {
	QCtx   context.Context
	Cancel context.CancelFunc
	Cursor []byte
	Size   int
}

func NewDbManager(logger *zap.Logger, session *gocql.Session) *DatabaseManager {
	return &DatabaseManager{
		Cassandra:    session,
		Log:          logger,
		QueryTimeout: 15 * time.Second,
	}
}
