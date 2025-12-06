package proxy

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

// Structs for the Tenor API response
type TenorResponse struct {
	Results []struct {
		Media []map[string]struct {
			URL string `json:"url"`
		} `json:"media"`
		Title string `json:"title"`
	} `json:"results"`
}

func TenorSearchGif() {
	apiKey := "LIVDSRZULELA" // Tenor API key
	query := "excited"
	limit := 8
	url := fmt.Sprintf("https://g.tenor.com/v1/search?q=%s&key=%s&limit=%d", query, apiKey, limit)

	// Send GET request
	resp, err := http.Get(url)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		panic(err)
	}

	// Parse JSON response
	var tenorResp TenorResponse
	if err := json.Unmarshal(body, &tenorResp); err != nil {
		panic(err)
	}

	// Print top 8 GIF URLs
	for i, result := range tenorResp.Results {
		if len(result.Media) > 0 {
			// Typically "gif" or "tinygif" key contains the GIF URL
			gifURL := result.Media[0]["gif"].URL
			fmt.Printf("%d: %s\n", i+1, gifURL)
		}
	}
}
