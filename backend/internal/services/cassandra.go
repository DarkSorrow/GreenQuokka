package services

import (
	"log"
	"os"

	"github.com/gocql/gocql"
)

func CassandraSession() *gocql.Session {
	dbKeyspace := os.Getenv("DB_KEYSPACE")
	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASS")
	dbHost := os.Getenv("DB_HOST")

	/*conn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8&parseTime=True&loc=Local", dbUser, dbPass, dbHost, "3306", dbName)*/
	cluster := gocql.NewCluster(dbHost)
	cluster.Keyspace = dbKeyspace
	cluster.Consistency = gocql.LocalQuorum
	cluster.Authenticator = gocql.PasswordAuthenticator{
		Username: dbUser,
		Password: dbPass,
	}
	cluster.NumConns = 4 // Change with number of CPU?
	session, errConnect := cluster.CreateSession()
	if errConnect != nil {
		log.Fatal(errConnect)
	}

	return session
}
