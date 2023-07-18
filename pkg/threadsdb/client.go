package threadsdb

import (
	"errors"
	"fmt"
	"log"
	"os"
	"runtime"

	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3"
)

type ThreadsDb interface {
	LoadDatabase() *sqlx.DB
	CloseDatabase()
	InitializeSchema()
	Firstload()
	UsersRepo
}

type ThreadsDbClient struct {
	ThreadsDb
	Db *sqlx.DB
}

func (client *ThreadsDbClient) LoadDatabase() *sqlx.DB {

	if runtime.GOOS == "windows" {
		userCacheDir, userCacheDirErr := os.UserCacheDir()
		if userCacheDirErr != nil {
			println("Error:", userCacheDirErr.Error())
		}

		// ensure directory exists
		if _, err := os.Stat(userCacheDir + "/DhaagaApp/databases"); errors.Is(err, os.ErrNotExist) {
			err := os.Mkdir(userCacheDir+"/DhaagaApp/databases", os.ModePerm)
			if err != nil {
				log.Println(err)
			}
		}

		db, err := sqlx.Open("sqlite3", userCacheDir+"/DhaagaApp/databases/threads.db")
		if err != nil {
			log.Fatal(err)
		}
		client.Db = db
		// run all migrations
		client.InitializeSchema()
		return db
	} else {
		db, err := sqlx.Open("sqlite3", "%APPDATA%/DhaagaApp/threads.db")
		if err != nil {
			log.Fatal(err)
		}
		client.Db = db
		// run all migrations
		client.InitializeSchema()
		return db
	}

}

func (client *ThreadsDbClient) CloseDatabase() {
	client.Db.Close()
}

func (client *ThreadsDbClient) InitializeSchema() {
	// BEGIN -- v0.0.0 -- BEGIN
	usersDb := `
	CREATE TABLE IF NOT EXISTS users (
		pk TEXT PRIMARY KEY,
		username TEXT,
		profile_pic_url TEXT,
		follower_count INT DEFAULT 0,
		full_name TEXT,
		is_verified INT DEFAULT 0,
		visit_count_local INT DEFAULT 0,
		favourited_local INT DEFAULT 0
	);`
	// END -- v0.0.0 -- END

	// BEGIN -- v0.1.0 -- BEGIN
	threadsDb := `
		CREATE TABLE IF NOT EXISTS threads (
			id TEXT PRIMARY KEY,
			thread_type TEXT NOT NULL,
			user_pk TEXT,
			favourited_local INT DEFAULT 0
		);`

	postsDb := `
	CREATE TABLE IF NOT EXISTS posts (
		id TEXT PRIMARY KEY,
		pk TEXT NOT NULL,
		user_pk TEXT NOT NULL,
		code TEXT NOT NULL,

		caption_text TEXT,
		quoted_post_pk TEXT,
		reposted_post_fk TEXT,

		taken_at DATETIME NOT NULL,
		like_count INT DEFAULT 0,
		reply_count INT DEFAULT 0,
		liked_local INT DEFAULT 0
	)`
	assetsDb := `
	CREATE TABLE IF NOT EXISTS assets (
		asset_url TEXT,
		post_id TEXT,
		asset_type TEXT,
		liked_local INT DEFAULT 0
	);`
	// END -- v0.2.0 -- END

	db := client.Db

	db.MustExec(usersDb)
	db.MustExec(threadsDb)
	db.MustExec(postsDb)
	db.MustExec(assetsDb)

	fmt.Println("Initialized schema")
}

// Firstload will run any pending migrations for this db
func Firstload() {
	dbClient := ThreadsDbClient{}
	dbClient.LoadDatabase()

	// runs migrations
	dbClient.InitializeSchema()

	defer dbClient.CloseDatabase()

	fmt.Println("db setup complete for threads db")
}
