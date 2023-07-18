package main

import (
	"embed"
	"os"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp()

	userCacheDir, userCacheDirErr := os.UserCacheDir()
	if userCacheDirErr != nil {
		println("Error:", userCacheDirErr.Error())
	}

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "Dhaaga Client",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
		Windows: &windows.Options{
			WebviewUserDataPath: userCacheDir + "\\DhaagaApp",
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
