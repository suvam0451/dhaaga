package threadsdb

import (
	"browser/pkg/utils"
	"fmt"
	"log"

	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3"
)

type ThreadsDb interface {
	LoadDatabase()
	CloseDatabase()
	InitializeSchema()
	Firstload()
}

type ThreadsDbClient struct {
	ThreadsDb
	UsersRepo
	PostsRepo
	AccountsRepo
	CredentialsRepo

	ThreadsRepo
	Db *sqlx.DB
}

func (client *ThreadsDbClient) LoadDatabase() *sqlx.DB {
	dbDir := utils.GetDatabasesFolder()
	db, err := sqlx.Open("sqlite3", dbDir+"/threads.db")
	if err != nil {
		log.Fatal(err)
	}
	client.Db = db
	return db
}

func (client *ThreadsDbClient) CloseDatabase() {
	client.Db.Close()
}

// InitializeSchema runs the db migrations
func (client *ThreadsDbClient) InitializeSchema() {
	db := client.Db

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

	// BEGIN -- v0.2.0 -- BEGIN
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

	carousalDb := `
	CREATE TABLE IF NOT EXISTS carousal (
		post_id TEXT,
		asset_url TEXT,
		asset_type TEXT,
		liked_local INT DEFAULT 0,

		id TEXT PRIMARY KEY,
		pk TEXT NOT NULL
	);`
	// END -- v0.2.0 -- END

	// BEGIN -- v0.3.0 -- BEGIN
	// END -- v0.3.0 -- END

	db.MustExec(usersDb)
	db.MustExec(threadsDb)
	db.MustExec(postsDb)
	db.MustExec(assetsDb)
	db.MustExec(carousalDb)

	// BEGIN -- v0.4.0 -- BEGIN
	updateAssetsAddVideoUrl := `
	ALTER TABLE assets
  ADD video_download_url TEXT;
	`
	// END -- v0.4.0 -- END

	if _, err := db.Exec(updateAssetsAddVideoUrl); err != nil {

	}

	fmt.Println("Initialized schema for data db")
}
