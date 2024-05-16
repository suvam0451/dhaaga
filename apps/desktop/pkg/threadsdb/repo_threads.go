package threadsdb

import (
	"browser/pkg/threadsapi"
	"fmt"
)

type ThreadsRepo interface {
	UpsertThread(thread threadsapi.ThreadsApi_Thread, user *threadsapi.ThreadsApi_User)
	GetPostsForThreadId(threadId string) []threadsapi.ThreadsApi_Post
	GetThreadInfoUsingThreadId(threadId string) threadsapi.ThreadsApi_Thread
}

// UpsertThread inserts or updates a thread
func (client *ThreadsDbClient) UpsertThread(thread threadsapi.ThreadsApi_Thread, user *threadsapi.ThreadsApi_User) bool {
	tx, err := client.Db.Beginx()

	query := `
	INSERT INTO threads 
		(id, thread_type, user_pk) VALUES (?,?,?)
		ON CONFLICT(id) 
		DO UPDATE SET thread_type=excluded.thread_type;
		`
	statement, err := tx.Preparex(query)
	defer statement.Close()

	if err != nil {
		fmt.Println("statement prep error", err)
		return false
	} else {
		_, execError := statement.Exec(thread.Id, thread.ThreadType, user.Pk)
		if execError != nil {
			fmt.Println("statement exec error", execError)
			return false
		}
		commitErr := tx.Commit()
		if commitErr != nil {
			fmt.Println("commit error", commitErr)
			return false
		}
		fmt.Println("[INFO]: upserted thread", thread.Id)
		return true
	}
}

// GetPostsForThread returns a list of posts for a thread
func (client *ThreadsDbClient) GetPostsForThreadId(id string) []threadsapi.ThreadsApi_Post {
	rows, err := client.Db.Queryx("SELECT * FROM posts WHERE thread_id = ", id)
	if err != nil {
		fmt.Println(err)
		return nil
	}
	defer rows.Close()

	var results []threadsapi.ThreadsApi_Post
	for rows.Next() {
		var target threadsapi.ThreadsApi_Post
		rows.StructScan(&target)
		results = append(results, threadsapi.ThreadsApi_Post{})
	}
	return results
}

func (client *ThreadsDbClient) GetThreadInfoUsingThreadId(threadId string) (row threadsapi.ThreadsApi_Thread) {
	db := client.Db

	err := db.Get(&row, "SELECT * FROM threads WHERE id = ?", threadId)
	if err != nil {
		fmt.Println(err)
		return row
	}

	fmt.Println(row)
	return row
}
