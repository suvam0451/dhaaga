package utils

import (
	"fmt"
	"os"
	"runtime"
)

// GetDatabasesFolder returns the path to the databases folder for each os
func GetDatabasesFolder() string {
	databaseDir := "./databases"
	if runtime.GOOS == "windows" {
		userCacheDir, userCacheDirErr := os.UserCacheDir()
		if userCacheDirErr != nil {
			println("Error:", userCacheDirErr.Error())
		}
		databaseDir = userCacheDir + "/DhaagaApp/databases"
	} else if runtime.GOOS == "darwin" {
		userCacheDir, userCacheDirErr := os.UserCacheDir()
		if userCacheDirErr != nil {
			println("Error:", userCacheDirErr.Error())
		}
		databaseDir = userCacheDir + "/com.suvam0451.DhaagaApp/databases"
	} else {
		fmt.Println("[INFO]: Linux platform is currently and Unsupported OS")
	}
	return databaseDir
}

// GetDowloadsFolder returns the path to the downloads folder for each os
func GetDowloadsFolder() string {
	homeDir, homeDirErr := os.UserHomeDir()
	if homeDirErr != nil {
		println("Error:", homeDirErr.Error())
	}

	downloadsDir := homeDir + "\\Downloads"
	return downloadsDir
}

func GetUserDataFolder() string {
	userDataDir := "./"
	if runtime.GOOS == "windows" {
		userCacheDir, userCacheDirErr := os.UserCacheDir()
		if userCacheDirErr != nil {
			println("Error:", userCacheDirErr.Error())
		}
		userDataDir = userCacheDir + "/DhaagaApp"
	} else if runtime.GOOS == "darwin" {
		userCacheDir, userCacheDirErr := os.UserCacheDir()
		if userCacheDirErr != nil {
			println("Error:", userCacheDirErr.Error())
		}
		userDataDir = userCacheDir + "/com.suvam0451.DhaagaApp"
	} else {
		fmt.Println("[INFO]: Linux platform is currently and Unsupported OS")
	}
	return userDataDir
}
