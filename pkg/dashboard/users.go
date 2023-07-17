package dashboard

import (
	"browser/pkg/threadsapi"
	"browser/pkg/threadsdb"
)

type SearchUsersQuery struct {
	Query          string `json:"query"`
	FavouritedOnly bool   `json:"favouritedOnly"`
	Limit          int    `json:"limit"`
	Offset         int    `json:"offset"`
}

type SearchUsersResponse struct {
	Items []threadsapi.ThreadsApi_User `json:"items"`
	Total int                          `json:"total"`
}

func SearchUsers(q SearchUsersQuery) SearchUsersResponse {
	client := threadsdb.ThreadsDbClient{}
	client.LoadDatabase()
	defer client.CloseDatabase()

	var all []threadsapi.ThreadsApi_User
	db := client.Db
	db.Select(&all,
		"SELECT pk, username, profile_pic_url FROM users WHERE username LIKE ? LIMIT ? OFFSET ?",
		"%"+q.Query+"%", q.Limit, q.Offset)

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
	return SearchUsersResponse{
		Items: all,
		Total: len(all),
	}
}
