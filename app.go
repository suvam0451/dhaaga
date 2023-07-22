package main

import (
	"browser/pkg/dashboard"
	"browser/pkg/services"
	"browser/pkg/threadsapi"
	"browser/pkg/threadsdb"
	"browser/pkg/utils"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"regexp"
	"strings"

	"github.com/gocolly/colly"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

var THREADS_API_URL = "https://www.threads.net/api/graphql"
var IG_APP_ID = "238260118697367"
var DOC_ID = "6529829603744567"
var USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" +
	"(KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.67"

	// ThreadsNetApiInvoke makes a post request to the threads.net graphql api
func ThreadsNetApiInvoke[T any](query map[string]string, docId string, lsd string) (data T, err error) {
	// url
	THREADS_API_URL := "https://www.threads.net/api/graphql"
	IG_APP_ID := "238260118697367"

	// body
	json_str, _ := json.Marshal(query)

	bodyObject := url.Values{
		"variables": {string(json_str)},
		"doc_id":    {docId},
		"lsd":       {lsd},
	}

	// request
	req, _ := http.NewRequest(http.MethodPost, THREADS_API_URL,
		strings.NewReader(bodyObject.Encode()))

	// headers
	req.Header.Add("X-Ig-App-Id", IG_APP_ID)
	req.Header.Add("X-Fb-Lsd", lsd)
	// req.Header.Add("User-Agent", "any")
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	resp, respErr := http.DefaultClient.Do(req)

	if respErr != nil {
		return
	}
	defer resp.Body.Close()

	if respErr != nil {
		fmt.Println(respErr)
	} else {
		var response threadsapi.ThreadsGraphQlReturnType[T]
		body, _ := ioutil.ReadAll(resp.Body)
		// fmt.Println(string(body))

		if unmarshalError := json.Unmarshal(body, &response); unmarshalError != nil {
			return
		} else {
			return response.Data, nil
		}
	}
	return
}

// GetImagesForThread_Impl returns all images for a post
func GetImagesForThread_Impl(postId string, lsd string) threadsapi.ThreadsApiPostQuery {
	// body
	postIdObject := map[string]string{
		"postID": postId,
	}

	json_str, _ := json.Marshal(postIdObject)

	bodyObject := url.Values{
		"variables": {string(json_str)},
		"doc_id":    {DOC_ID},
		"lsd":       {lsd},
	}

	// request
	req, _ := http.NewRequest(http.MethodPost, THREADS_API_URL,
		strings.NewReader(bodyObject.Encode()))

	// headers
	req.Header.Add("X-Ig-App-Id", IG_APP_ID)
	req.Header.Add("X-Fb-Lsd", lsd)
	// req.Header.Add("User-Agent", "any")
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	resp, respErr := http.DefaultClient.Do(req)
	if respErr != nil {
		return threadsapi.ThreadsApiPostQuery{}
	}
	defer resp.Body.Close()

	if respErr != nil {
		fmt.Println(respErr)
	} else {
		var response threadsapi.ThreadsGraphQlReturnType[threadsapi.ThreadsApiPostQuery]
		body, _ := ioutil.ReadAll(resp.Body)
		fmt.Println(string(body))

		if err := json.Unmarshal(body, &response); err != nil {
			return threadsapi.ThreadsApiPostQuery{}
		} else {
			return response.Data
		}
	}
	return threadsapi.ThreadsApiPostQuery{}
}

// GetImageAssetsForPost returns a list of asset urls for a post
func GetImageAssetsForPost(parentPostId string, post *threadsapi.ThreadsApi_Post, depth int) (assets []utils.PostImageDTO) {
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

type getImagesForProfileReturnType struct {
	user   threadsapi.ThreadsApi_User
	assets []string
}

func GetImagesForProfile_Controller(url string) []utils.PostImageDTO {
	worker := services.CollyWorker{}
	worker.Callback = func(r *colly.Response) {
		worker.Body = r.Body

		userId := worker.CollectUserId()

		lsd := worker.CollectLsd()
		docId := "6451898791498605"

		if userId == nil || lsd == nil {
			return
		}

		if data, apiErr := ThreadsNetApiInvoke[threadsapi.ThreadsApiUserThreadsQuery](map[string]string{
			"userID": *userId,
		}, docId, *lsd); apiErr != nil {
			return
		} else {
			threads := data.MediaData.Threads
			for i := 0; i < len(threads); i++ {
				thread := threads[i]
				for j := 0; j < len(thread.ThreadItems); j++ {
					threadItem := thread.ThreadItems[j]
					assetsToAdd := GetImageAssetsForPost(threadItem.Post.Id, threadItem.Post, 0)
					worker.Assets = append(worker.Assets, assetsToAdd...)
				}
			}
		}
	}

	worker.Visit(url)
	return worker.Assets
}

// GetImagesForThread_Controller returns a list of asset urls for a thread
func GetImagesForThread_Controller(url string) []utils.PostImageDTO {
	worker := services.CollyWorker{}
	worker.Callback = func(r *colly.Response) {
		worker.Body = r.Body

		postId := worker.CollectPostId()
		lsd := worker.CollectLsd()
		docId := "6529829603744567"

		if postId == nil || lsd == nil {
			return
		}

		if data, apiErr := ThreadsNetApiInvoke[threadsapi.ThreadsGraphQlDataNested](map[string]string{
			"postID": *postId,
		}, docId, *lsd); apiErr != nil {
			return
		} else {
			thread := data.Data.ContainingThread
			user := threadsapi.GetUserForThread(thread)

			client := threadsdb.ThreadsDbClient{}
			client.LoadDatabase()
			client.UpsertThread(thread, user)
			client.CloseDatabase()

			for i := 0; i < len(thread.ThreadItems); i++ {
				item := thread.ThreadItems[i]
				worker.Assets = append(worker.Assets, GetImageAssetsForPost(item.Post.Id, item.Post, 0)...)
			}
		}
	}

	worker.Visit(url)
	return worker.Assets
}

// SearchUsers_Impl returns a list of users matching the query
func SearchUsers_Impl(query string) []threadsapi.ThreadsApi_User {
	if len(query) < 3 {
		return []threadsapi.ThreadsApi_User{}
	}
	client := threadsdb.ThreadsDbClient{}
	client.LoadDatabase()
	defer client.CloseDatabase()

	return client.SearchUsers(query)
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	// startup scripts for this app
	threadsdb.Firstload()
	utils.VerifyUserSettings()
}

// GetImagesFromThread returns a list of asset urls for a given thread
func (a *App) GetImagesFromThread(url string) []utils.PostImageDTO {
	return GetImagesForThread_Controller(url)
}

// GetImagesForProfile returns a list of asset urls for a given username
func (a *App) GetImagesForProfile(username string) []utils.PostImageDTO {
	return GetImagesForProfile_Controller(username)
}

// GetAsset returns a byte array of the requested image
func (a *App) GetAsset(url string) string {
	return utils.GetAsset(url)
}

func (a *App) SearchUsers(query string) []threadsapi.ThreadsApi_User {
	return SearchUsers_Impl(query)
}

func (a *App) DashboardSearchUsers(q dashboard.SearchUsersQuery) dashboard.SearchUsersResponse {
	return dashboard.SearchUsers(q)
}

func GetDatabasePostInfo_Impl(postId string) utils.PostDetailsDTO {
	client := threadsdb.ThreadsDbClient{}
	var retval utils.PostDetailsDTO

	client.LoadDatabase()
	defer client.CloseDatabase()

	// fetch the original post
	post := client.GetPostInfoUsingPostId(postId)
	user := client.GetUserInfoUsingUserId(post.UserPk)
	post.User = user
	retval.OriginalPost = post
	fmt.Println("original post retrieved", post.RepostedPostFk)

	// fetch the reposted post (if applicable)
	if post.RepostedPostFk != nil {
		fmt.Println("getting reposted post for", *post.RepostedPostFk)
		repostedPost := client.GetPostInfoUsingPostId(*post.RepostedPostFk)
		repostedUser := client.GetUserInfoUsingUserId(repostedPost.UserPk)
		repostedPost.User = repostedUser
		retval.RepostedPost = &repostedPost
		fmt.Println("reposted post retrieved", post)
	}

	return retval
}

// RequestPostInfo returns info for a post, aggregated from local db.
// This includes OP info, repost info, etc.
func (a *App) GetDatabasePostInfo(postId string) utils.PostDetailsDTO {
	return GetDatabasePostInfo_Impl(postId)
}

func (a *App) SelectDownloadsFolder() string {
	dialogOptions := runtime.OpenDialogOptions{}

	selected, err := runtime.OpenDirectoryDialog(a.ctx, dialogOptions)
	if err != nil {
		fmt.Println(err)
		return ""
	}
	utils.SetDownloadsDirectory(selected)
	return selected
}

func (a *App) GetDownloadsFolder() string {
	return utils.GetDownloadsDirectory()
}

func (a *App) GetUserDataDirectory() string {
	return utils.GetUserDataDirectory()
}

func (a *App) SetUserFavourite(pk string) {
	client := threadsdb.ThreadsDbClient{}
	client.LoadDatabase()
	defer client.CloseDatabase()
	client.SetUserFavourite(pk)
	return
}

func (a *App) UnsetUserFavourite(pk string) {
	client := threadsdb.ThreadsDbClient{}
	client.LoadDatabase()
	defer client.CloseDatabase()
	client.UnsetUserFavourite(pk)
	return
}

// ------- Credentials Manager ----------------
func (a *App) GetAccount(domain string, subdomain string, username string) *threadsdb.ThreadsDb_Account {
	client := threadsdb.ThreadsDbAdminClient{}
	client.LoadDatabase()
	defer client.CloseDatabase()
	return client.GetAccount(domain, subdomain, username)
}

func (a *App) GetAccoutsBySubdomain(domain string, subdomain string) []threadsdb.ThreadsDb_Account {
	client := threadsdb.ThreadsDbAdminClient{}
	client.LoadDatabase()
	defer client.CloseDatabase()
	return client.GetAccoutsBySubdomain(domain, subdomain)
}

func (a *App) UpsertAccount(account threadsdb.ThreadsDb_Account) bool {
	client := threadsdb.ThreadsDbAdminClient{}
	client.LoadDatabase()
	defer client.CloseDatabase()
	return client.UpsertAccount(account)
}

func (a *App) UpsertCredential(account threadsdb.ThreadsDb_Account, name string, value string) bool {
	client := threadsdb.ThreadsDbAdminClient{}
	client.LoadDatabase()
	defer client.CloseDatabase()
	return client.UpsertCredential(account, name, value)
}

func (a *App) GetCredentialsByAccountId(id int) []threadsdb.ThreadsDb_Credential {
	client := threadsdb.ThreadsDbAdminClient{}
	client.LoadDatabase()
	defer client.CloseDatabase()
	return client.GetCredentialsByAccountId(id)
}

func (a *App) GetCustomDeviceId() string {
	return utils.GetCustomDeviceId()
}

func (a *App) SetCustomDeviceId(deviceId string) bool {
	return utils.SetCustomDeviceId(deviceId)
}
