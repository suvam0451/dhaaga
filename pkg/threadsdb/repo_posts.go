package threadsdb

import (
	"browser/pkg/threadsapi"
	"fmt"
	"time"
)

type PostsRepo interface {
	UpsertPost(post threadsapi.ThreadsApi_Post)
	UpsertRepostedPost(post threadsapi.ThreadsApi_Post)
}

// UpsertPost inserts or updates a post
func (client *ThreadsDbClient) UpsertPost(post *threadsapi.ThreadsApi_Post) (*string, bool) {
	// adding user profile pic
	user := threadsapi.GetUserForPost(post)
	threadPk := threadsapi.GetThreadPk(post)
	postId := threadsapi.GetPostPk(post)
	captionText := threadsapi.GetCaptionText(post)

	if user == nil || threadPk == "" || postId == "" {
		return nil, false
	}

	query := `
	INSERT INTO posts
	(id, pk, code, caption_text, taken_at, like_count, reply_count)
	VALUES (?,?,?,?,?,?,?)
	ON CONFLICT(id)
	DO UPDATE SET caption_text=excluded.caption_text, taken_at=excluded.taken_at, like_count=excluded.like_count, reply_count=excluded.reply_count;
	`
	// TODO: add reply calculation
	if _, err := client.Db.Exec(query, postId, threadPk, post.Code, captionText,
		time.Unix(post.TakenAt, 0), post.LikeCount, 0); err != nil {
		fmt.Println("error upserting post", err)
		return nil, false
	}
	return &postId, true
}

// UpsertRepostedPost inserts or updates a reposted post
func (client *ThreadsDbClient) UpsertRepostedPost(post *threadsapi.ThreadsApi_Post, respostedPostFk string) (*string, bool) {
	// adding user profile pic
	user := threadsapi.GetUserForPost(post)
	threadPk := threadsapi.GetThreadPk(post)
	postId := threadsapi.GetPostPk(post)
	captionText := threadsapi.GetCaptionText(post)

	if user == nil || threadPk == "" || postId == "" {
		return nil, false
	}

	query := `
	INSERT INTO posts
	(id, pk, code, caption_text, taken_at, like_count, reply_count, reposted_post_fk)
	VALUES (?,?,?,?,?,?,?,?)
	ON CONFLICT(id)
	DO UPDATE SET caption_text=excluded.caption_text, 
		taken_at=excluded.taken_at, like_count=excluded.like_count, 
		reply_count=excluded.reply_count, reposted_post_fk=excluded.reposted_post_fk;
	`
	// TODO: add reply calculation
	if _, err := client.Db.Exec(query, postId, threadPk, post.Code, captionText,
		time.Unix(post.TakenAt, 0), post.LikeCount, 0, respostedPostFk); err != nil {
		fmt.Println("error upserting post", err)
		return nil, false
	}
	return &postId, true
}
