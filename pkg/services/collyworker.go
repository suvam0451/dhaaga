package services

import (
	"regexp"

	"github.com/gocolly/colly"
)

var USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" +
	"(KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.67"

type CollyWorkerInterface interface {
	Visit(url string)
	CollectLsd() string
	CollectUserId() string
	CollectPostId() string
}

// CollyWorker is collects posts and
// aggregates images for a thread
type CollyWorker struct {
	CollyWorkerInterface
	Body     []byte
	Assets   []string
	Callback colly.ResponseCallback
}

func (worker CollyWorker) Visit(url string) {
	c := colly.NewCollector()

	c.OnRequest(func(r *colly.Request) {
		r.Headers.Set("User-Agent", USER_AGENT)
		r.Headers.Set("Sec-Fetch-Mode", "navigate")
	})

	c.OnResponse(worker.Callback)

	c.Visit(url)
	return
}

func FindTokenInPage(body []byte, regex *regexp.Regexp) *string {
	itemFound := regex.FindStringSubmatch(string(body))
	if itemFound == nil {
		return nil
	}

	return &itemFound[1]
}

func (worker CollyWorker) CollectLsd() *string {
	regex, _ := regexp.Compile("\"LSD\".*?{\"token\":\"(.*?)\"")
	return FindTokenInPage(worker.Body, regex)
}

func (worker CollyWorker) CollectPostId() *string {
	regex, _ := regexp.Compile("\"post_id\":\"(.*?)\"")
	return FindTokenInPage(worker.Body, regex)
}

func (worker CollyWorker) CollectUserId() *string {
	regex, _ := regexp.Compile("\"user_id\": ?\"(.*?)\"")
	return FindTokenInPage(worker.Body, regex)
}
