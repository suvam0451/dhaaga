package threadsdb

import "fmt"

type ThreadsDb_Credential struct {
	Id              int64   `json:"id" db:"id"`
	AccountId       string  `json:"account_id" db:"account_id"`
	CredentialType  string  `json:"credential_type" db:"credential_type"`
	CredentialValue string  `json:"credential_value" db:"credential_value"`
	UpdatedAt       *string `json:"updated_at" db:"updated_at"`
}

type CredentialsRepo interface {
	GetCredentialsByAccountId(id int) []ThreadsDb_Credential
	UpsertCredential(account ThreadsDb_Account, name string, value string) bool
}

func (client *ThreadsDbAdminClient) GetCredentialsByAccountId(id int) []ThreadsDb_Credential {
	var credentials []ThreadsDb_Credential
	err := client.Db.Select(&credentials, "SELECT * FROM credentials WHERE account_id = ?", id)
	if err != nil {
		fmt.Println("[WARN]: error fetching credentials for account", err)
	}
	return credentials
}

// UpsertCredential inserts or updates a credential for an account
// provide domain, subdomain and username to use
func (client *ThreadsDbAdminClient) UpsertCredential(account *ThreadsDb_Account, name string, value string) bool {
	if account == nil {
		return false
	}
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
