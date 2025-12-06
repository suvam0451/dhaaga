package proxy

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

// Structs for request and response
type TranslateRequest struct {
	Text       []string `json:"text"`
	TargetLang string   `json:"target_lang"`
}

type Translation struct {
	DetectedSourceLanguage string `json:"detected_source_language"`
	Text                   string `json:"text"`
}

type TranslateResponse struct {
	Translations []Translation `json:"translations"`
}

func DeeplTranslate() {
	authKey := "YOUR_AUTH_KEY" // replace with your actual DeepL API key
	url := "https://api.deepl.com/v2/translate"

	// Prepare the request
	reqBody := TranslateRequest{
		Text:       []string{"Hello, world!"},
		TargetLang: "DE",
	}

	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		panic(err)
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		panic(err)
	}

	req.Header.Set("Authorization", "DeepL-Auth-Key "+authKey)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("User-Agent", "YourApp/1.2.3")

	// Send the request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	// Read and decode the response
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		panic(err)
	}

	var translateResp TranslateResponse
	if err := json.Unmarshal(body, &translateResp); err != nil {
		panic(err)
	}

	// Print translations
	for _, t := range translateResp.Translations {
		fmt.Printf("Detected Source Language: %s\n", t.DetectedSourceLanguage)
		fmt.Printf("Translated Text: %s\n", t.Text)
	}
}
