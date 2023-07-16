package dashboard

import (
	"browser/pkg/threadsapi"
	"browser/pkg/threadsdb"
)

type SearchUsersQuery struct {
	Query          string `json:"query"`
	FavouritedOnly bool   `json:"favouritedOnly"`
	Limit          int    `json:"limit"`
}

func SearchUsers(q SearchUsersQuery) (all []threadsapi.ThreadsApi_User) {
	client := threadsdb.ThreadsDbClient{}
	client.LoadDatabase()
	defer client.CloseDatabase()

	db := client.Db
	db.Select(&all,
		"SELECT pk, username, profile_pic_url FROM users WHERE username LIKE ? LIMIT",
		"%"+q.Query+"%", q.Limit)

	// filter for locally favourited
	if q.FavouritedOnly {
		n := 0
		for _, val := range all {
			if val.FavouritedLocal {
				all[n] = val
				n++
			}
		}
		all = all[:n]
	}
	return
}
