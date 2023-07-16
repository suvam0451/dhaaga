package utils

import "browser/pkg/threadsapi"

// PostImageDTO is a dto with the image asset and it's post id
type PostImageDTO struct {
	AssetUrl string `json:"asset_url"`
	PostId   string `json:"post_id"`
}

type PostDetailsDTO struct {
	OriginalPost threadsapi.ThreadsApi_Post
	RepostedPost *threadsapi.ThreadsApi_Post
}
