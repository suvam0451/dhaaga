package instagram

import (
	"browser/pkg/dbworker"
	"browser/pkg/threadsapi"
	"browser/pkg/utils"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"
)

type InstagramApiInterface interface {
	LoadCredentials(token string, lsdToken string) bool
	SetAccessToken(accessToken string) bool
	GetUserProfileThreads(userId string, maxId string) bool
}

type InstagramApiClient struct {
	InstagramApiInterface

	Token    string
	LsdToken string
}

func (a *InstagramApiClient) SetAccessToken(token string) bool {
	a.Token = token
	return true
}

func (a *InstagramApiClient) LoadCredentials(accessToken string, lsdToken string) bool {
	a.Token = accessToken
	a.LsdToken = lsdToken

	return true
}

func (a *InstagramApiClient) GetUserProfileThreads(userId string, maxId string) (string, error) {
	if a.Token == "" {
		return "", errors.New("token cannot be empty")
	}
	BLOCKS_VERSION := "5f56efad68e1edec7801f630b5c122704ec5378adbee6609a448f105f34a9c73"
	LOCALE := "en-US"
	LOCALE_INSTAGRM := strings.Replace(LOCALE, "-", "_", 1)
	INTAGRAM_APP_ID := "3419628305025917"

	headers := http.Header{
		"User-Agent":            {"Barcelona 291.0.0.31.111 Android"},
		"Content-Type":          {"application/x-www-form-urlencoded; charset=UTF-8"},
		"Authorization":         {fmt.Sprintf("Bearer IGT:2:%s", a.Token)},
		"X-Bloks-Is-Layout-Rtl": {"false"},
		"X-Bloks-Version-Id":    {BLOCKS_VERSION},
		"X-Ig-App-Id":           {INTAGRAM_APP_ID},
		"Accept-Language":       {LOCALE},
		"X-Ig-App-Locale":       {LOCALE_INSTAGRM},
		"X-Ig-Device-Locale":    {LOCALE_INSTAGRM},
		"X-Ig-Mapped-Locale":    {LOCALE_INSTAGRM},
		"X-Ig-Android-Id":       {utils.GetCustomDeviceId()},
	}

	BASE_URL := "https://i.instagram.com"
	MAX_ID_QUERY := ""
	if maxId != "" {
		MAX_ID_QUERY = fmt.Sprintf("?max_id=%s", maxId)
	}

	apiUrl := fmt.Sprintf("%s/api/v1/text_feed/%s/profile/%s", BASE_URL, userId, MAX_ID_QUERY)

	req, _ := http.NewRequest(http.MethodGet, apiUrl, nil)
	req.Header = headers

	res, err := http.DefaultClient.Do(req)

	if err != nil {
		fmt.Println(err)
	}

	defer res.Body.Close()
	if res.StatusCode != 200 {
		fmt.Println("[WARN]: request failed")
		return "", errors.New("request failed")
	}

	body, err := io.ReadAll(res.Body)
	var output threadsapi.ThreadsApi_Private_TextFeed_Profile

	if err := json.Unmarshal(body, &output); err != nil { // Parse []byte to go struct pointer
		fmt.Println("Can not unmarshal JSON", err)
		return "", errors.New("could not marshal json")
	}

	dbworker.ProcessTextfeedProfile(output)
	return output.NextMaxId, nil
}
