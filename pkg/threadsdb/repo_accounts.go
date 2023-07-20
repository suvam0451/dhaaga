package threadsdb

import "fmt"

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
	SearchAccountsBySubdomain(domain string, subdomain string)
	[]ThreadsDb_Account
	UpsertCredential(account ThreadsDb_Account, name string, value string) bool
	GetCredentialForAccount(account ThreadsDb_Account, name string) *ThreadsDb_Credential
	GetAccoutsBySubdomain(domain string, subdomain string) []ThreadsDb_Account
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

func (client *ThreadsDbAdminClient) UpsertAccount(account ThreadsDb_Account) bool {
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

// UpsertCredential inserts or updates a credential for an account
// provide domain, subdomain and username to use
func (client *ThreadsDbAdminClient) UpsertCredential(account ThreadsDb_Account, name string, value string) bool {
	//dedup
	conflict := client.GetAccount(account.Domain, account.Subdomain, account.Username)
	if conflict == nil {
		fmt.Println("[INFO]: conflict while updating credential. user not found.")
		return false
	}

	existingCredential := client.GetCredentialForAccount(*conflict, name)
	if existingCredential == nil {
		_, err := client.Db.Exec(`INSERT INTO credentials 
			(account_id, credential_type, credential_value, updated_at) VALUES (?,?,?,?);`, conflict.Id, name, value, "now()")
		if err != nil {
			return false
		}
		fmt.Println("[INFO]: updated credential", name, "for account", account.Domain, account.Subdomain, account.Username)
		return true
	} else {
		_, err := client.Db.Exec(`UPDATE credentials SET credential_value = ?, updated_at = ? WHERE account_id = ? AND credential_type = ?;`,
			value, "now()", conflict.Id, name)
		if err != nil {
			return false
		}

		fmt.Println("[INFO]: updated credential", name, "for account", account.Domain, account.Subdomain, account.Username)
		return true
	}
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
