package threadsdb

import (
	"browser/pkg/threadsapi"
	"fmt"
)

type AssetDB struct {
	PostId           string `db:"post_id"`
	AssetUrl         string `db:"asset_url"`
	AssetType        string `db:"asset_type"`
	LikedLocal       bool   `db:"liked_local"`
	VideoDownloadUrl string `db:"video_download_url"`
}

type AssetsRepo interface {
	InsertImageForPost(post threadsapi.ThreadsApi_Post, url string)
	InsertUniqueImageAssetForPost(post threadsapi.ThreadsApi_Post, url string)
}

// InsertImageForPost inserts an image for a post
func (client *ThreadsDbClient) InsertImageForPost(post threadsapi.ThreadsApi_Post, url string, videoUrl *string) {
	assetType := "image"
	if videoUrl != nil {
		assetType = "video"
	}

	if videoUrl != nil {
		client.Db.Exec("INSERT INTO assets (post_id, asset_url, asset_type, video_download_url) VALUES (?,?,?,?)",
			post.Id, url, assetType, *videoUrl)
		return
	} else {
		client.Db.Exec("INSERT INTO assets (post_id, asset_url, asset_type) VALUES (?,?,?)",
			post.Id, url, assetType)
	}

	return
}

func (client *ThreadsDbClient) InsertUniqueImageAssetForPost(
	post threadsapi.ThreadsApi_Post, url string, videoUrl *string) {
	assetType := "image"
	if videoUrl != nil {
		assetType = "video"
	}

	var results []AssetDB
	selectAErr := client.Db.Select(&results, "SELECT post_id FROM assets WHERE post_id = ?", post.Id)
	if selectAErr != nil {
		return
	}

	if len(results) == 0 {
		client.InsertImageForPost(post, url, videoUrl)
	} else {
		selectBErr := client.Db.Select(&results, "SELECT post_id FROM assets WHERE post_id = ? AND asset_type = ?",
			post.Id, assetType)

		if selectBErr != nil {
			return
		}
		if len(results) == 0 {
			client.InsertImageForPost(post, url, videoUrl)
		} else {
			// fmt.printLn("asset already exists")
		}
	}

	fmt.Println(fmt.Sprintf("[INFO]: inserted assets for post id: %s", post.Id))
	return
}
