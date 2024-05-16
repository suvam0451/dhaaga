package threadsapi

import "encoding/json"

func GetUserForPost(post *ThreadsApi_Post) *ThreadsApi_User {
	return &post.User
}

func GetThreadPk(post *ThreadsApi_Post) json.Number {
	return post.Pk
}

func GetPostPk(post *ThreadsApi_Post) string {
	return post.Id
}

func GetCaptionText(post *ThreadsApi_Post) string {
	return post.Caption.Text
}
