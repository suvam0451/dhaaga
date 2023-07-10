package main

import (
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

type ThreadsApi_User struct {
	id              string
	username        string
	is_verified     bool
	pk              string
	profile_pic_url string
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
	OriginalHeight int    `json:"original_height"`
	OriginalWidth  int    `json:"original_width"`
	Pk             string `json:"pk"`
	HasAudio       bool   `json:"has_audio"`
	TakenAt        int    `json:"taken_at"`
	Id             string `json:"id"`

	// User
	ImageVersions2 ThreadsApi_Post_ImageVersions2 `json:"image_versions2"`
}

type ThreadsApi_ThreadItem struct {
	Post     ThreadsApi_Post `json:"post"`
	LineType string          `json:"line_type"`
	// should_show_replies_cta bool
}

type ThreadsApi_ContainingThread struct {
	ThreadItems []ThreadsApi_ThreadItem `json:"thread_items"`
}

type ThreadsApiPostQuery struct {
	ContainingThread ThreadsApi_ContainingThread `json:"containing_thread"`
	// reply_threads     []object
}

type ThreadsGraphQlDataNested[T any] struct {
	Data T `json:"data"`
}
type ThreadsGraphQlReturnType[T any] struct {
	Data ThreadsGraphQlDataNested[T] `json:"data"`
	// extensions struct {
	// 	IsFinal bool `json:"is_final"`
	// }
}

// GetImagesForThread_Impl returns all images for a post
func GetImagesForThread_Impl(postId string, lsd string) ThreadsApiPostQuery {
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
	req.Header.Add("User-Agent", "any")
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	resp, respErr := http.DefaultClient.Do(req)
	if respErr != nil {
		return ThreadsApiPostQuery{}
	}
	defer resp.Body.Close()

	if respErr != nil {
		fmt.Println(respErr)
	} else {
		var response ThreadsGraphQlReturnType[ThreadsApiPostQuery]
		body, _ := ioutil.ReadAll(resp.Body)
		fmt.Println(string(body))

		if err := json.Unmarshal(body, &response); err != nil {
			return ThreadsApiPostQuery{}
		} else {
			return response.Data.Data
		}
	}
	return ThreadsApiPostQuery{}
}

// GetImagesForThread_Controller returns a list of asset urls for a thread
func GetImagesForThread_Controller(id string) []string {
	url := "https://www.threads.net/t/" + id
	c := colly.NewCollector()

	var assets []string

	c.OnRequest(func(r *colly.Request) {
		r.Headers.Set("User-Agent", USER_AGENT)
		r.Headers.Set("Sec-Fetch-Mode", "navigate")
	})

	c.OnResponse(func(r *colly.Response) {
		lsdEx, regexErr1 := regexp.Compile("\"LSD\".*?{\"token\":\"(.*?)\"")
		postIdEx, regexErr2 := regexp.Compile("\"post_id\":\"(.*?)\"")

		if regexErr1 != nil || regexErr2 != nil {
			fmt.Println(regexErr1, regexErr2)
		} else {

			if !lsdEx.Match(r.Body) || !postIdEx.Match(r.Body) {
				fmt.Println("No match")
			} else {
				lsdFound := lsdEx.FindStringSubmatch(string(r.Body))
				postIdFound := postIdEx.FindStringSubmatch(string(r.Body))
				fmt.Println(lsdFound[1], postIdFound[1])
				res := GetImagesForThread_Impl(postIdFound[1], lsdFound[1])
				thread := res.ContainingThread
				for i := 0; i < len(thread.ThreadItems); i++ {
					item := thread.ThreadItems[i]
					if len(item.Post.ImageVersions2.Candidates) > 0 {
						assets = append(assets, item.Post.ImageVersions2.Candidates[0].Url)
					}
				}
			}
		}
	})

	c.Visit(url)
	return assets
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
