package threadsdb

import (
	"fmt"
	"log"
	"os"

	"github.com/jmoiron/sqlx"
)

type ThreadsDbAdminClient struct {
	ThreadsDb
	UsersRepo
	PostsRepo

	ThreadsRepo
	Db *sqlx.DB
}

func (client *ThreadsDbAdminClient) LoadDatabase() *sqlx.DB {
	cacheDir, cacheDirErr := os.UserCacheDir()
	if cacheDirErr != nil {
		log.Fatal(cacheDirErr)
	}
	db, err := sqlx.Open("sqlite3", cacheDir+"/DhaagaApp/databases/threads_admin.db")
	if err != nil {
		log.Fatal(err)
	}
	client.Db = db
	return db
}

func (client *ThreadsDbAdminClient) CloseDatabase() {
	client.Db.Close()
}

func (client *ThreadsDbAdminClient) InitializeSchema() {
	db := client.Db

	// BEGIN -- v0.4.0 -- BEGIN
	accountsDb := `
	CREATE TABLE IF NOT EXISTS accounts (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		domain TEXT,
		subdomain TEXT,
		username TEXT,
		password TEXT,
		last_login_at DATETIME,
		verified INT DEFAULT 0
	);`

	credentialsDb := `
	CREATE TABLE IF NOT EXISTS credentials (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		account_id INT NOT NULL,
		credential_type TEXT,
		credential_value TEXT,
		updated_at DATETIME
	);
	`
	db.MustExec(accountsDb)
	db.MustExec(credentialsDb)

	// END -- v0.4.0 -- END

	fmt.Println("Initialized schema for admin db")
}
