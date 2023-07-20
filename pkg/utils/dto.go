package utils

import "browser/pkg/threadsapi"

// PostImageDTO is a dto with the image asset and it's post id
type PostImageDTO struct {
	AssetUrl         string  `db:"asset_url" json:"asset_url"`
	PostId           string  `db:"post_id" json:"post_id"`
	AssetType        string  `db:"asset_type" json:"asset_type"`
	LikedLocal       bool    `db:"liked_local" json:"liked_local"`
	VideoDownloadUrl *string `db:"video_download_url" json:"video_download_url"`
}

type PostDetailsDTO struct {
	OriginalPost threadsapi.ThreadsApi_Post
	RepostedPost *threadsapi.ThreadsApi_Post
}
