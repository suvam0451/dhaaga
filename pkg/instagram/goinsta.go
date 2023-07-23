package instagram

import (
	"browser/pkg/threadsdb"
	"browser/pkg/utils"
	"errors"
	"fmt"
	"strconv"

	"github.com/Davincible/goinsta"
)

func SafeLogin(username string, password string) (bool, error) {
	DOMAIN := "meta"
	SUBDOMAIN := "threads"

	client := threadsdb.ThreadsDbAdminClient{}
	client.LoadDatabase()
	defer client.CloseDatabase()
	existingAccount := client.GetAccount(DOMAIN, SUBDOMAIN, username)
	fmt.Println("found account", existingAccount)

	if existingAccount != nil {
		return false, errors.New("account already exists. editing is not supported")
	}

	insta := goinsta.New(username, password)
	if err := insta.Login(); err != nil {
		return false, err
	} else {
		config := insta.ExportConfig()
		pfp := config.Account.ProfilePicURL
		fullname := config.Account.FullName
		userId := config.ID
		accessToken := config.Token

		accountCreated := client.UpsertAccount(utils.ThreadsDb_Account_Create_DTO{
			Domain:    DOMAIN,
			Subdomain: SUBDOMAIN,
		})
		if !accountCreated {
			return false, errors.New("login successful, but failed to create account")
		}

		account := client.GetAccount(DOMAIN, SUBDOMAIN, username)
		client.UpsertCredential(account, "profile_pic_url", pfp)
		client.UpsertCredential(account, "full_name", fullname)
		client.UpsertCredential(account, "user_id", strconv.FormatInt(userId, 10))
		client.UpsertCredential(account, "access_token", accessToken)

		return true, nil
	}
}
