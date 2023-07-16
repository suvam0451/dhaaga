package threadsdb

import (
	"browser/pkg/threadsapi"
)

type AssetDB struct {
	PostId     string `db:"id"`
	AssetUrl   string `db:"asset_url"`
	AssetType  string `db:"asset_type"`
	LikedLocal bool   `db:"liked_local"`
}

type AssetsRepo interface {
	InsertImageForPost(post threadsapi.ThreadsApi_Post, url string)
	InsertUniqueImageAssetForPost(post threadsapi.ThreadsApi_Post, url string)
}

// InsertImageForPost inserts an image for a post
func (client *ThreadsDbClient) InsertImageForPost(post threadsapi.ThreadsApi_Post, url string) {
	client.Db.Exec("INSERT INTO assets (post_id, asset_url, asset_type) VALUES (?,?,?)",
		post.Id, url, "image")
	return
}
func (client *ThreadsDbClient) InsertUniqueImageAssetForPost(
	post threadsapi.ThreadsApi_Post, url string) {
	var results []AssetDB
	client.Db.Select(&results, "SELECT post_id FROM assets WHERE post_id = ?", post.Id)
	if len(results) == 0 {
		client.InsertImageForPost(post, url)
	} else {
		client.Db.Select(&results, "SELECT post_id FROM assets WHERE post_id = ? AND asset_url = ? AND image_type = ?",
			post.Id, url, "image")
		if len(results) == 0 {
			client.InsertImageForPost(post, url)
		} else {
			// fmt.printLn("asset already exists")
		}
	}
	return
}
