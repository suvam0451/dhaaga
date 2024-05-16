package utils

type ThreadsDb_Account_Create_DTO struct {
	Domain    string `json:"domain" db:"domain"`
	Subdomain string `json:"subdomain" db:"subdomain"`
	Username  string `json:"username" db:"username"`
	Password  string `json:"password" db:"password"`
	Verified  bool   `json:"verified" db:"verified"`
}
