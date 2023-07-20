package utils

import (
	"encoding/base64"
	"fmt"
	"io/ioutil"
	"net/http"
	"regexp"
)

func GetAsset(url string) string {
	resp, respErr := http.Get(url)
	if respErr != nil {
		fmt.Println(respErr)
		return ""
	}

	byteArray, readErr := ioutil.ReadAll(resp.Body)
	if readErr != nil {
		fmt.Println(readErr)
		return ""
	}

	regex, _ := regexp.Compile("\\.(png|jpg|mp4)")
	itemFound := regex.FindStringSubmatch(url)

	if len(itemFound) >= 1 {
		enc := fmt.Sprintf("data:image/%s;base64,", itemFound[1])
		b64 := base64.StdEncoding.EncodeToString(byteArray)
		return enc + b64
	}
	return ""
}
