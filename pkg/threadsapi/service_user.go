package threadsapi

type ThreadsApi_User struct {
	Pk            string `json:"pk" db:"pk"`
	Id            string `json:"id"`
	Username      string `json:"username" db:"username"`
	IsVerified    bool   `json:"is_verified" db:"is_verified"`
	ProfilePicUrl string `json:"profile_pic_url" db:"profile_pic_url"`

	// db specific
	FollowerCount   int     `db:"follower_count"`
	FullName        *string `db:"full_name"`
	VisitCountLocal int     `db:"visit_count_local"`
	FavouritedLocal bool    `db:"favourited_local"`
}
