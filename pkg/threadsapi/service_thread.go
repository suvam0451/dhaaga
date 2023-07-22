package threadsapi

import "encoding/json"

type ThreadsApi_ThreadItem struct {
	Post     *ThreadsApi_Post `json:"post"`
	LineType string           `json:"line_type"`
	// should_show_replies_cta bool
}

type ThreadsApi_Thread struct {
	Id          json.Number             `json:"id" db:"id"`
	ThreadItems []ThreadsApi_ThreadItem `json:"thread_items"`
	ThreadType  string                  `json:"thread_type" db:"thread_type"`

	// db specific
	UserPk          string `db:"user_pk"`
	FavouritedLocal bool   `db:"favourited_local"`
}

type ThreadsApi_Thread_Methods interface {
	GetUser() *ThreadsApi_User
	GetUsernameForOwner() string
}

func (thread *ThreadsApi_Thread) GetUser() *ThreadsApi_User {
	if len(thread.ThreadItems) == 0 {
		return nil
	}
	return thread.ThreadItems[0].Post.GetUser()
}

func (thread *ThreadsApi_Thread) GetUsernameForOwner() string {
	if len(thread.ThreadItems) == 0 {
		return ""
	}
	return thread.ThreadItems[0].Post.GetUsernameForOwner()
}

func GetUserForThread(thread ThreadsApi_Thread) *ThreadsApi_User {
	if len(thread.ThreadItems) == 0 {
		return nil
	}
	return &thread.ThreadItems[0].Post.User
}
