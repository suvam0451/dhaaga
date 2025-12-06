package atproto_subscriber

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
)

type DIDDoc struct {
	Context            []string `json:"@context"`
	ID                 string   `json:"id"`
	AlsoKnownAs        []string `json:"alsoKnownAs"`
	VerificationMethod []struct {
		ID                 string `json:"id"`
		Type               string `json:"type"`
		Controller         string `json:"controller"`
		PublicKeyMultibase string `json:"publicKeyMultibase"`
	} `json:"verificationMethod"`
	Service []struct {
		ID              string `json:"id"`
		Type            string `json:"type"`
		ServiceEndpoint string `json:"serviceEndpoint"`
	} `json:"service"`
}

type DIDResponse struct {
	DID             string `json:"did"`
	DIDDoc          DIDDoc `json:"didDoc"`
	Handle          string `json:"handle"`
	Email           string `json:"email"`
	EmailConfirmed  bool   `json:"emailConfirmed"`
	EmailAuthFactor bool   `json:"emailAuthFactor"`
	AccessJwt       string `json:"accessJwt"`
	RefreshJwt      string `json:"refreshJwt"`
	Active          bool   `json:"active"`
}

var API_URL = "https://bsky.social/xrpc"

func getToken() (*DIDResponse, error) {
	requestBody, err := json.Marshal(map[string]string{
		"identifier": os.Getenv("BLUESKY_IDENTIFIER"),
		"password":   os.Getenv("BLUESKY_APP_PASSWORD"),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request body: %w", err)
	}

	url := fmt.Sprintf("%s/com.atproto.server.createSession", API_URL)

	resp, err := http.Post(url, "application/json", bytes.NewBuffer(requestBody))
	if err != nil {
		return nil, fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	var tokenResponse DIDResponse
	if err := json.NewDecoder(resp.Body).Decode(&tokenResponse); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	return &tokenResponse, nil
}

func Stream() {
	url := "https://bsky.social/xrpc/com.atproto.sync.subscribeRepos"
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.Fatal(err)
	}

	// Use your app token here (not user token)
	req.Header.Set("Authorization", "Bearer <token>")
	req.Header.Set("Accept", "text/event-stream")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Fatal(err)
	}
	defer resp.Body.Close()

	scanner := bufio.NewScanner(resp.Body)
	for scanner.Scan() {
		line := scanner.Text()
		if len(line) > 0 {
			fmt.Println("Event:", line)
		}
	}
	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}
}

// func handleEvent(evt RepoCommitEvent) error {
// 	for _, op := range evt.Ops {
// 		if op.Action == "create" {
// 			if len(evt.Blocks) > 0 {
// 				err := handleCARBlocks(evt.Blocks, op)
// 				if err != nil {
// 					slog.Error("Error handling CAR blocks", "error", err)
// 					return err
// 				}
// 			}
// 		}
// 	}

// 	return nil
// }
