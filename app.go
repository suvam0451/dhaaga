package main

import (
	"browser/pkg/services"
	"browser/pkg/threadsapi"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"regexp"
	"strings"

	"github.com/gocolly/colly"
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
	// DOC_ID := "6529829603744567"

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
func GetImageAssetsForPost(post *threadsapi.ThreadsApi_Post, depth int) (assets []string) {
	fmt.Println(depth)
	// TODO: add support for recursive post fetching
	if depth >= 2 {
		return
	}

	// adding items from this post
	if len(post.ImageVersions2.Candidates) == 0 {
	} else {
		invalidRegex, _ := regexp.Compile("rsrc.php/null.jpg")
		candidate := post.ImageVersions2.Candidates[0].Url
		if !invalidRegex.MatchString(candidate) {
			assets = append(assets, candidate)
		}
	}

	// adding items from adjacent posts
	shareInfo := post.TextPostAppInfo.ShareInfo

	if shareInfo.QuotedPost != nil {
		assets = append(assets, GetImageAssetsForPost(shareInfo.QuotedPost, depth+1)...)
	}
	if shareInfo.RepostedPost != nil {
		assets = append(assets, GetImageAssetsForPost(shareInfo.RepostedPost, depth+1)...)
	}

	return
}

//func GetPostsForProfile_Controller(username string) []string {
//	url := "https://www.threads.net/t/" + username
//}

// GetImagesForThread_Controller returns a list of asset urls for a thread
func GetImagesForThread_Controller(id string) []string {
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
			for i := 0; i < len(thread.ThreadItems); i++ {
				item := thread.ThreadItems[i]
				worker.Assets = append(worker.Assets, GetImageAssetsForPost(item.Post, 0)...)
			}
		}
	}

	url := "https://www.threads.net/t/" + id
	worker.Visit(url)
	return worker.Assets
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

// GetImagesFromThread_Impl returns a list of asset urls
func (a *App) GetImagesFromThread(url string) []string {
	return GetImagesForThread_Controller(url)
}

// func (a *App) GetPostsForProfile(username string) []string {
// return GetPostsForProfile_Controller(username)
// }
