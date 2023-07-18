package utils

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
)

func VerifyUserSettings() (bool, error) {
	userDataFolder := GetUserDataFolder()

	if _, err := os.Stat(userDataFolder + "/user-settings.json"); err == nil {
		fmt.Printf("File exists\n")
		// try to fix any discrepancies
		file, _ := ioutil.ReadFile(userDataFolder + "/user-settings.json")
		var settings UserSettigs
		json.Unmarshal(file, &settings)

		// fix downlods directory being empty string
		if settings.DownloadsDirectory == "" {
			settings.DownloadsDirectory = GetDowloadsFolder()
		}

		settingsJson, _ := json.Marshal(settings)
		ioutil.WriteFile(userDataFolder+"/user-settings.json", settingsJson, 0644)
	} else {
		// create the user settings file with sane defaults
		settings := UserSettigs{
			DownloadsDirectory: GetDowloadsFolder(),
		}
		settingsJson, _ := json.Marshal(settings)
		ioutil.WriteFile(userDataFolder+"/user-settings.json", settingsJson, 0644)
	}
	return true, nil
}
