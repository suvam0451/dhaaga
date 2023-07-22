package utils

import (
	"encoding/json"
	"io/ioutil"
)

type UserSettings struct {
	DownloadsDirectory string `json:"downloadsDirectory"`
	CustomDeviceId     string `json:"customDeviceId"`
}

func GetUserDataDirectory() string {
	userDataFolder := GetUserDataFolder()
	return userDataFolder
}

// ---- Downloads Directory ----

func GetDownloadsDirectory() string {
	userDataFolder := GetUserDataFolder()
	file, _ := ioutil.ReadFile(userDataFolder + "/user-settings.json")
	var settings UserSettings
	json.Unmarshal(file, &settings)
	return settings.DownloadsDirectory
}

func SetDownloadsDirectory(dir string) {
	userDataFolder := GetUserDataFolder()
	file, _ := ioutil.ReadFile(userDataFolder + "/user-settings.json")
	var settings UserSettings
	json.Unmarshal(file, &settings)
	settings.DownloadsDirectory = dir
	settingsJson, _ := json.Marshal(settings)
	ioutil.WriteFile(userDataFolder+"/user-settings.json", settingsJson, 0644)
}

// ---- Custom Device ID ----

func GetCustomDeviceId() string {
	userDataFolder := GetUserDataFolder()
	file, _ := ioutil.ReadFile(userDataFolder + "/user-settings.json")
	var settings UserSettings
	json.Unmarshal(file, &settings)
	return settings.CustomDeviceId
}

func SetCustomDeviceId(deviceId string) bool {
	userDataFolder := GetUserDataFolder()
	file, _ := ioutil.ReadFile(userDataFolder + "/user-settings.json")
	var settings UserSettings
	json.Unmarshal(file, &settings)
	settings.CustomDeviceId = deviceId
	settingsJson, _ := json.Marshal(settings)
	ioutil.WriteFile(userDataFolder+"/user-settings.json", settingsJson, 0644)
	return true
}

// ---- Instagram Token File ----
