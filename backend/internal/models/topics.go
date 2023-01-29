package models

type Topic struct {
	Topics string `json:"topics"`
	Count  int64  `json:"count"`
}

func (db DatabaseManager) QueryTopic(qctx *QueryContext, legalID *string) (*[]Topic, *PageOptions, error) {
	itr := db.Cassandra.Query(
		"SELECT topics, count FROM topics_count WHERE legal_id = ?",
		*legalID,
	).WithContext(qctx.QCtx).PageSize(qctx.Size).PageState(qctx.Cursor).Iter()
	defer itr.Close()
	cursor := itr.PageState()
	scanner := itr.Scanner()
	topics := make([]Topic, 0, itr.NumRows())
	for scanner.Next() {
		var (
			topic *string
			count *int64
		)
		err := scanner.Scan(
			&topic, &count,
		)
		if err != nil {
			return nil, nil, err
		}
		topics = append(topics, Topic{
			Topics: cassandraDefault(topic, ""),
			Count:  cassandraDefault(count, 1),
		})
	}
	return &topics, getPageOption(cursor, itr.NumRows()), nil
}
