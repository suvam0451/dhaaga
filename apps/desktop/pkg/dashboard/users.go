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

	totalCount := 0

	if q.FavouritedOnly {
		client.Db.Get(&totalCount,
			"SELECT COUNT(*) FROM users WHERE username LIKE ? AND favourited_local = 1", "%"+q.Query+"%")
	} else {
		client.Db.Get(&totalCount,
			"SELECT COUNT(*) FROM users WHERE username LIKE ?", "%"+q.Query+"%")
	}

	var all []threadsapi.ThreadsApi_User
	db := client.Db
	db.Select(&all,
		"SELECT * FROM users WHERE username LIKE ? LIMIT ? OFFSET ?",
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
		Total: totalCount,
	}
}
