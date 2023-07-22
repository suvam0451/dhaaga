package threadsapi

import "encoding/json"

type ThreadsApi_Post_Methods interface {
	GetUser() *ThreadsApi_User
	GetUsernameForOwner() string
	GetCaption() string
	GetTakenAt() int64
	GetLikeCount() int
	IsReposted() bool
	IsQuoted() bool
}

type ThreadsApi_Caption struct {
	Text string `json:"text"`
}

type ThreadsApi_Post struct {
	Pk              json.Number                               `json:"pk"` // e.g. - xxxxx
	Id              string                                    `json:"id"` // e.g. - xxxxx_yyy
	User            ThreadsApi_User                           `json:"user"`
	Code            string                                    `json:"code"`
	OriginalHeight  int                                       `json:"original_height"`
	OriginalWidth   int                                       `json:"original_width"`
	HasAudio        bool                                      `json:"has_audio"`
	TakenAt         int64                                     `json:"taken_at"`
	TextPostAppInfo ThreadsApi_Post_TextPostAppInfo           `json:"text_post_app_info"`
	ImageVersions2  ThreadsApi_Post_ImageVersions2            `json:"image_versions2"`
	VideoVersions   *[]ThreadsApi_PostVideoVersions_ArrayItem `json:"video_versions"`

	Caption   ThreadsApi_Caption `json:"caption"`
	LikeCount int                `json:"like_count" db:"like_count"`
	ThreadsApi_Post_Methods

	// database fields
	RepostedPostFk *string `db:"reposted_post_fk"`
	QuotedPostPk   *string `db:"quoted_post_pk"`
	LikedLocal     bool    `db:"liked_local"`
	CaptionText    string  `db:"caption_text"`
	ReplyCount     int     `db:"reply_count"`
	TakenAtDate    string  `db:"taken_at"`
	UserPk         string  `db:"user_pk"`
}

func (post *ThreadsApi_Post) GetUser() *ThreadsApi_User {
	return &post.User
}

func (post *ThreadsApi_Post) GetUsernameForOwner() string {
	return post.User.Username
}

func (post *ThreadsApi_Post) GetCaption() string {
	return post.Caption.Text
}

func (post *ThreadsApi_Post) GetTakenAt() int64 {
	return post.TakenAt
}

func (post *ThreadsApi_Post) IsReposted() bool {
	return post.TextPostAppInfo.ShareInfo.RepostedPost != nil
}

func (post *ThreadsApi_Post) IsQuoted() bool {
	return post.TextPostAppInfo.ShareInfo.QuotedPost != nil
}

func (post *ThreadsApi_Post) GetLikeCount() int {
	return post.LikeCount
}
