package utils

import (
	"encoding/json"
	"io/ioutil"
)

type UserSettigs struct {
	DownloadsDirectory string `json:"downloadsDirectory"`
}

func GetDownloadsDirectory() string {
	userDataFolder := GetUserDataFolder()
	file, _ := ioutil.ReadFile(userDataFolder + "/user-settings.json")
	var settings UserSettigs
	json.Unmarshal(file, &settings)
	return settings.DownloadsDirectory
}

func GetUserDataDirectory() string {
	userDataFolder := GetUserDataFolder()
	return userDataFolder
}

func SetDownloadsDirectory(dir string) {
	userDataFolder := GetUserDataFolder()
	file, _ := ioutil.ReadFile(userDataFolder + "/user-settings.json")
	var settings UserSettigs
	json.Unmarshal(file, &settings)
	settings.DownloadsDirectory = dir
	settingsJson, _ := json.Marshal(settings)
	ioutil.WriteFile(userDataFolder+"/user-settings.json", settingsJson, 0644)
}
