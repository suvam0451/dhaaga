package utils

import (
	"errors"
	"fmt"
	"log"
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

	// ensure directory exists
	if _, err := os.Stat(databaseDir); errors.Is(err, os.ErrNotExist) {
		err := os.MkdirAll(databaseDir, os.ModePerm)
		if err != nil {
			log.Println(err)
		}
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

	if _, err := os.Stat(userDataDir); errors.Is(err, os.ErrNotExist) {
		err := os.Mkdir(userDataDir, os.ModePerm)
		if err != nil {
			log.Println(err)
		}
	}
	return userDataDir
}

func GetApplicationCacheDir() string {
	userCacheDir, _ := os.UserCacheDir()

	userCacheDir = userCacheDir + "/com.suvam0451.DhaagaApp"
	if _, err := os.Stat(userCacheDir); errors.Is(err, os.ErrNotExist) {
		err := os.Mkdir(userCacheDir, os.ModePerm)
		if err != nil {
			log.Println(err)
		}
	}

	return userCacheDir
}
