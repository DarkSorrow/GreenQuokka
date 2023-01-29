package models

import (
	"time"

	"github.com/gocql/gocql"
)

type Template struct {
	Topic       string    `json:"topic"`
	Subject     string    `json:"subject"`
	Version     int       `json:"version"`
	Description string    `json:"description"`
	Format      string    `json:"format"`
	Active      bool      `json:"active"`
	SchemaBody  *[]byte   `json:"schema_body"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedBy   string    `json:"updatedBy"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

var TemplateTopics = map[string]bool{
	"quote":   true,
	"invoice": true,
}

func (db DatabaseManager) QueryTemplates(qctx *QueryContext, topic *string, legalID *string) (*[]Template, *PageOptions, error) {
	itr := db.Cassandra.Query(
		"SELECT subject,version,description,format,active,schema_body,updated_at,updated_by FROM templates WHERE legal_id = ? AND topic = ?",
		*legalID,
	).WithContext(qctx.QCtx).PageSize(qctx.Size).PageState(qctx.Cursor).Iter()
	defer itr.Close()
	cursor := itr.PageState()
	scanner := itr.Scanner()
	templates := make([]Template, 0, itr.NumRows())
	for scanner.Next() {
		var (
			subject     *string
			version     *int
			description *string
			format      *string
			active      *bool
			schema_body *[]byte
			updated_at  time.Time
			updated_by  gocql.UUID
		)
		err := scanner.Scan(
			&subject, &version, &description, &format, &active, &schema_body, &updated_at, &updated_by,
		)
		if err != nil {
			return nil, nil, err
		}
		templates = append(templates, Template{
			Topic:       *topic,
			Subject:     cassandraDefault(subject, ""),
			Version:     cassandraDefault(version, 1),
			Description: cassandraDefault(description, ""),
			Format:      cassandraDefault(format, ""),
			Active:      cassandraDefault(active, true),
			SchemaBody:  schema_body,
			UpdatedAt:   updated_at,
			UpdatedBy:   updated_by.String(),
		})
	}
	return &templates, getPageOption(cursor, itr.NumRows()), nil
}

func (db DatabaseManager) QueryTemplate(qctx *QueryContext, legalID *string, topic *string, subject *string) (*Template, error) {
	var (
		version     *int
		description *string
		format      *string
		active      *bool
		schema_body *[]byte
		updated_at  time.Time
		updated_by  gocql.UUID
	)
	if err := db.Cassandra.Query(
		"SELECT version,description,format,active,schema_body,updated_at,updated_by FROM templates WHERE legal_id = ? AND topic = ? AND subject = ?",
		*legalID, *topic, *subject,
	).WithContext(qctx.QCtx).Scan(
		&version, &description, &format, &active, &schema_body, &updated_at, &updated_by,
	); err != nil {
		return nil, err
	}
	return &Template{
		Topic:       *topic,
		Subject:     *subject,
		Version:     cassandraDefault(version, 1),
		Description: cassandraDefault(description, ""),
		Format:      cassandraDefault(format, ""),
		Active:      cassandraDefault(active, true),
		SchemaBody:  schema_body,
		UpdatedAt:   updated_at,
		UpdatedBy:   updated_by.String(),
	}, nil
}

func (db DatabaseManager) QueryIsNewTemplate(qctx *QueryContext, legalID *string, template *Template) (bool, error) {
	var created_at *time.Time
	if err := db.Cassandra.Query(
		"SELECT created_at FROM templates WHERE legal_id = ? AND topic = ? AND subject = ? AND version = ?",
		*legalID, template.Topic, template.Subject, template.Version,
	).WithContext(qctx.QCtx).Scan(
		&created_at,
	); err != nil {
		return false, err
	}
	if created_at == nil {
		return false, nil
	}
	return true, nil
}
