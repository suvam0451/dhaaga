package instagram

import (
	"github.com/Davincible/goinsta"
)

// Login usus goinsta to login and export the config
func Login(username string, password string) *goinsta.ConfigFile {
	insta := goinsta.New(username, password)

	// Only call Login the first time you login. Next time import your config
	if err := insta.Login(); err != nil {
		// fmt.Println("[INFO]: error caught", err)
		return nil
	} else {

	}
	config := insta.ExportConfig()
	return &config
}
