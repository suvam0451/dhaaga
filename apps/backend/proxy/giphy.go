package proxy

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
)

// Structs for GIPHY API response
type GiphyResponse struct {
	Data []struct {
		ID     string `json:"id"`
		URL    string `json:"url"`
		Title  string `json:"title"`
		Images struct {
			Original struct {
				URL string `json:"url"`
			} `json:"original"`
		} `json:"images"`
	} `json:"data"`
	Pagination struct {
		TotalCount int `json:"total_count"`
		Count      int `json:"count"`
		Offset     int `json:"offset"`
	} `json:"pagination"`
	Meta struct {
		Status int    `json:"status"`
		Msg    string `json:"msg"`
	} `json:"meta"`
}

func GiphySearch() {
	apiKey := "YOUR_GIPHY_API_KEY" // replace with your actual GIPHY API key
	query := "excited"
	limit := 8

	// Build URL with query parameters
	baseURL := "https://api.giphy.com/v1/gifs/search"
	u, err := url.Parse(baseURL)
	if err != nil {
		panic(err)
	}
	q := u.Query()
	q.Set("api_key", apiKey)
	q.Set("q", query)
	q.Set("limit", fmt.Sprintf("%d", limit))
	u.RawQuery = q.Encode()

	// Send GET request
	resp, err := http.Get(u.String())
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		panic(err)
	}

	// Parse JSON response
	var giphyResp GiphyResponse
	if err := json.Unmarshal(body, &giphyResp); err != nil {
		panic(err)
	}

	// Print top GIF URLs
	for i, gif := range giphyResp.Data {
		fmt.Printf("%d: %s - %s\n", i+1, gif.Title, gif.Images.Original.URL)
	}
}
