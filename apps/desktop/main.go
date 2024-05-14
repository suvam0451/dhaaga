package main

import (
	"browser/pkg/threadsdb"
	"browser/pkg/utils"
	"embed"
	"fmt"

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

	utils.GetDatabasesFolder()
	fmt.Println(utils.GetUserDataFolder())
	threadsdb.Firstload()

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
			WebviewUserDataPath: utils.GetUserDataFolder(),
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
