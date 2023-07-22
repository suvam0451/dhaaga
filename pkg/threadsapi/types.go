package threadsapi

type ThreadsApi_Post_ImageVersions2_Candidates struct {
	Height   int    `json:"height"`
	Url      string `json:"url"`
	Width    int    `json:"width"`
	Typename string `json:"__typename"` // XDTImageCandidate
}

type ThreadsApi_Post_ImageVersions2 struct {
	Candidates []ThreadsApi_Post_ImageVersions2_Candidates `json:"candidates"`
}

type ThreadsApi_PostVideoVersions_ArrayItem struct {
	Type     int    `json:"type"`
	Url      string `json:"url"`
	Typename string `json:"__typename"` // XDTVideoVersion
}

type ThreadsApi_ShareInfo struct {
	QuotedPost   *ThreadsApi_Post `json:"quoted_post"`
	RepostedPost *ThreadsApi_Post `json:"reposted_post"`
}

type ThreadsApi_Post_TextPostAppInfo struct {
	// LinkPreviewAttachment []string `json:"link_preview_attachment"`
	ShareInfo ThreadsApi_ShareInfo `json:"share_info"`
}

type ThreadsApiPostQuery struct {
	ContainingThread ThreadsApi_Thread `json:"containing_thread"`
	// reply_threads     []object
}

type ThreadsApi_MediaData struct {
	Threads []ThreadsApi_Thread `json:"threads"`
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
