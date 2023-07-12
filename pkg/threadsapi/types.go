package threadsapi

type ThreadsApi_User struct {
	Id            string `json:"id"`
	Username      string `json:"username"`
	IsVerified    bool   `json:"is_verified"`
	Pk            string `json:"pk"`
	ProfilePicUrl string `json:"profile_pic_url"`
}

type ThreadsApi_Post_ImageVersions2_Candidates struct {
	Height int    `json:"height"`
	Url    string `json:"url"`
	Width  int    `json:"width"`
}

type ThreadsApi_Post_ImageVersions2 struct {
	Candidates []ThreadsApi_Post_ImageVersions2_Candidates `json:"candidates"`
}

type ThreadsApi_Post struct {
	Pk              string                          `json:"pk"` // e.g. - xxxxx
	Id              string                          `json:"id"` // e.g. - xxxxx_yyy
	User            ThreadsApi_User                 `json:"user"`
	OriginalHeight  int                             `json:"original_height"`
	OriginalWidth   int                             `json:"original_width"`
	HasAudio        bool                            `json:"has_audio"`
	TakenAt         int                             `json:"taken_at"`
	TextPostAppInfo ThreadsApi_Post_TextPostAppInfo `json:"text_post_app_info"`
	ImageVersions2  ThreadsApi_Post_ImageVersions2  `json:"image_versions2"`
}

type ThreadsApi_ShareInfo struct {
	QuotedPost   *ThreadsApi_Post `json:"quoted_post"`
	RepostedPost *ThreadsApi_Post `json:"reposted_post"`
}

type ThreadsApi_Post_TextPostAppInfo struct {
	// LinkPreviewAttachment []string `json:"link_preview_attachment"`
	ShareInfo ThreadsApi_ShareInfo `json:"share_info"`
}

type ThreadsApi_ThreadItem struct {
	Post     *ThreadsApi_Post `json:"post"`
	LineType string           `json:"line_type"`
	// should_show_replies_cta bool
}

type ThreadsApi_ContainingThread struct {
	ThreadItems []ThreadsApi_ThreadItem `json:"thread_items"`
}

type ThreadsApiPostQuery struct {
	ContainingThread ThreadsApi_ContainingThread `json:"containing_thread"`
	// reply_threads     []object
}

type ThreadsApi_MediaData_ThreadFragment struct {
	ThreadItems []ThreadsApi_ThreadItem `json:"thread_items"`
}

type ThreadsApi_MediaData struct {
	Threads []ThreadsApi_MediaData_ThreadFragment `json:"threads"`
}

// userID query output
type ThreadsApiUserThreadsQuery struct {
	MediaData ThreadsApi_MediaData `json:"mediaData"`
}

type ThreadsGraphQlDataNested struct {
	Data ThreadsApiPostQuery `json:"data"`
}

type ThreadsGraphQlReturnType[T any] struct {
	Data T `json:"data"`
	// extensions struct {
	// 	IsFinal bool `json:"is_final"`
	// }
}
