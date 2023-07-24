package threadsdb

import (
	"browser/pkg/utils"
	"fmt"
)

type ThreadsDb_Account struct {
	Id          int64   `json:"id" db:"id"`
	Domain      string  `json:"domain" db:"domain"`
	Subdomain   string  `json:"subdomain" db:"subdomain"`
	Username    string  `json:"username" db:"username"`
	Password    string  `json:"password" db:"password"`
	LastLoginAt *string `json:"last_login_at" db:"last_login_at"`
	Verified    bool    `json:"verified" db:"verified"`
}

type AccountsRepo interface {
	GetAccount(domain string, subdomain string, username string) ThreadsDb_Account
	UpsertAccount(account ThreadsDb_Account) bool
	SearchAccountsBySubdomain(domain string, subdomain string) []ThreadsDb_Account
	GetCredentialForAccount(account ThreadsDb_Account, name string) *ThreadsDb_Credential
	GetAccoutsBySubdomain(domain string, subdomain string) []ThreadsDb_Account
	GetSubdomainsForDomain(domain string) []string
}

func (client *ThreadsDbAdminClient) GetCredentialForAccount(account ThreadsDb_Account, name string) *ThreadsDb_Credential {
	var credential ThreadsDb_Credential
	err := client.Db.Get(&credential,
		`SELECT * FROM credentials
		WHERE account_id = ? AND credential_type = ?;`, account.Id, name)

	if err != nil {
		return nil
	}
	return &credential
}

func (client *ThreadsDbAdminClient) GetAccount(domain string, subdomain string, username string) *ThreadsDb_Account {
	var account ThreadsDb_Account
	err := client.Db.Get(&account,
		`SELECT * FROM accounts 
		WHERE domain = ? AND subdomain = ? AND username = ?;`,
		domain, subdomain, username)

	if err != nil {
		return nil
	}
	return &account
}

func (client *ThreadsDbAdminClient) UpsertAccount(account utils.ThreadsDb_Account_Create_DTO) bool {
	//dedup
	conflict := client.GetAccount(account.Domain, account.Subdomain, account.Username)
	if conflict != nil {
		fmt.Println("[INFO]: conflict while inserting user")
		return false
	}

	tx, _ := client.Db.Beginx()

	query := `INSERT INTO accounts 
		(domain, subdomain, username, password) VALUES (?,?,?,?)`
	statement, _ := tx.Preparex(query)
	defer statement.Close()
	_, execError := statement.Exec(account.Domain, account.Subdomain, account.Username, account.Password)
	if execError != nil {
		fmt.Println("statement exec error", execError)
		return false
	}

	commitErr := tx.Commit()
	if commitErr != nil {
		return false
	}

	fmt.Println("[INFO]: upserted account", account.Domain, account.Subdomain, account.Username)
	return true
}

func (client *ThreadsDbAdminClient) GetAccoutsBySubdomain(domain string, subdomain string) []ThreadsDb_Account {
	var accounts []ThreadsDb_Account
	err := client.Db.Select(&accounts,
		`SELECT * FROM accounts 
		WHERE domain = ? AND subdomain = ?;`,
		domain, subdomain)
	if err != nil {
		return nil
	}
	return accounts
}

func (client *ThreadsDbAdminClient) GetSubdomainsForDomain(domain string) []string {
	var results []string

	err := client.Db.Select(&results,
		`SELECT DISTINCT subdomain FROM accounts
		WHERE domain = ?;`, domain)
	if err != nil {
		fmt.Println("[WARN]: error while getting subdomains for domain", domain)
		return []string{}
	}
	return results
}
