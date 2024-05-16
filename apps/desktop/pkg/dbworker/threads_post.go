package dbworker

import (
	"browser/pkg/threadsapi"
	"browser/pkg/threadsdb"
	"browser/pkg/utils"
	"regexp"
)

// GetImageAssetsForPost returns a list of asset urls for a post
func GetImageAssetsForPost(parentPostId string,
	post *threadsapi.ThreadsApi_Post, depth int) (assets []utils.PostImageDTO) {
	// TODO: add support for recursive post fetching
	if post == nil || depth >= 2 {
		return
	}

	dbClient := threadsdb.ThreadsDbClient{}
	dbClient.LoadDatabase()
	dbClient.UpsertUser(post.User)
	defer dbClient.CloseDatabase()

	if depth == 0 {
		if post.IsReposted() {
			repostOrigin, upsertErr := dbClient.UpsertPost(post.TextPostAppInfo.ShareInfo.RepostedPost)
			if upsertErr == true {
				dbClient.UpsertRepostedPost(post, *repostOrigin)
			}
		} else {
			dbClient.UpsertPost(post)
		}
	}

	var videoUrl *string
	var assetType string
	assetType = "image"
	if post.VideoVersions != nil && len(*post.VideoVersions) > 0 {
		videoUrl = &(*post.VideoVersions)[0].Url
		assetType = "video"
	}

	// adding items from this post
	if len(post.ImageVersions2.Candidates) == 0 {
	} else {
		invalidRegex, _ := regexp.Compile("rsrc.php/null.jpg")
		candidate := post.ImageVersions2.Candidates[0].Url
		if !invalidRegex.MatchString(candidate) {
			dbClient.InsertUniqueImageAssetForPost(*post, candidate, videoUrl)
			assets = append(assets, utils.PostImageDTO{
				AssetUrl:         candidate,
				PostId:           parentPostId,
				AssetType:        assetType,
				VideoDownloadUrl: videoUrl,
			})
		}
	}

	// adding items from adjacent posts
	shareInfo := post.TextPostAppInfo.ShareInfo

	if shareInfo.QuotedPost != nil {
		assets = append(assets, GetImageAssetsForPost(parentPostId, shareInfo.QuotedPost, depth+1)...)
	}
	if shareInfo.RepostedPost != nil {
		assets = append(assets, GetImageAssetsForPost(parentPostId, shareInfo.RepostedPost, depth+1)...)
	}

	return
}

// ProcessTextfeedProfile processes the output of a profile's text feed
func ProcessTextfeedProfile(input threadsapi.ThreadsApi_Private_TextFeed_Profile) ([]utils.PostImageDTO, string, error) {
	dbClient := threadsdb.ThreadsDbClient{}
	dbClient.LoadDatabase()
	defer dbClient.CloseDatabase()

	nextMaxId := input.NextMaxId
	assetsToAdd := []utils.PostImageDTO{}

	for _, thread := range input.Threads {
		for _, item := range thread.ThreadItems {
			nextSet := GetImageAssetsForPost(item.Post.Id, item.Post, 0)
			assetsToAdd = append(assetsToAdd, nextSet...)
			dbClient.UpsertThread(thread, thread.GetUser())
		}
	}
	return assetsToAdd, nextMaxId, nil
}
