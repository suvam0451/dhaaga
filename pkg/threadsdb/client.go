package threadsdb

import (
	"browser/pkg/threadsapi"
	"database/sql"
	"fmt"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

type ThreadsDb interface {
	LoadDatabase()
	CloseDatabase()
	InitializeSchema()
	UpsertUser(user threadsapi.ThreadsApi_User)
}

type ThreadsDbClient struct {
	ThreadsDb
	db *sql.DB
}

func (client *ThreadsDbClient) LoadDatabase() *sql.DB {
	db, err := sql.Open("sqlite3", "./threads.db")
	if err != nil {
		log.Fatal(err)
	}
	client.db = db
	// run all migrations
	client.InitializeSchema()
	return db
}

func (client *ThreadsDbClient) CloseDatabase() {
	client.db.Close()
}

func (client *ThreadsDbClient) InitializeSchema() {
	// BEGIN -- v0.0.0 -- BEGIN
	usersDb := `CREATE TABLE IF NOT EXISTS users (
		pk TEXT PRIMARY KEY,
		username TEXT,
		profile_pic_url TEXT,
		follower_count INT DEFAULT 0,
		full_name TEXT,
		is_verified INT DEFAULT 0,
		visit_count INT DEFAULT 0,
		favourite INT DEFAULT 0,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);`
	// END -- v0.0.0 -- END

	query, err := client.db.Prepare(usersDb)
	if err != nil {
		fmt.Println(err)
	}
	query.Exec()
}

func (client *ThreadsDbClient) UpsertUser(user threadsapi.ThreadsApi_User) bool {
	if user.Pk == "" {
		fmt.Println("skipping user upsert operation")
		return false
	}
	tx, err := client.db.Begin()

	// fmt.Println("upserting user", user.Pk, user.Username, user.ProfilePicUrl)
	query := `INSERT INTO users 
		(pk, username, profile_pic_url) VALUES (?,?,?)
		ON CONFLICT(pk) 
		DO UPDATE SET username=excluded.username, profile_pic_url=excluded.profile_pic_url;`
	statement, err := tx.Prepare(query)
	defer statement.Close()

	if err != nil {
		fmt.Println("statement prep error", err)
		return false
	} else {
		result, execError := statement.Exec(user.Pk, user.Username, user.ProfilePicUrl)
		if execError != nil {
			fmt.Println("statement exec error", execError)
			return false
		}
		commitErr := tx.Commit()
		if commitErr != nil {
			fmt.Println("commit error", commitErr)
			return false
		}
		fmt.Println("upserted an user", result)
		return true
	}
}

// SearchUsers returns a list of users partially matching the query
func (client *ThreadsDbClient) SearchUsers(query string) (results []threadsapi.ThreadsApi_User) {
	rows, err := client.db.Query("SELECT pk, username, profile_pic_url FROM users WHERE username LIKE ?", "%"+query+"%")
	if err != nil {
		fmt.Println(err)
		return nil
	}
	defer rows.Close()

	for rows.Next() {
		var pk string
		var username string
		var profile_pic_url string
		rows.Scan(&pk, &username, &profile_pic_url)
		results = append(results, threadsapi.ThreadsApi_User{
			Pk:            pk,
			Username:      username,
			ProfilePicUrl: profile_pic_url,
		})
	}
	return
}
