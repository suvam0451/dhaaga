package threadsdb

import "fmt"

type ThreadsDb_Credential struct {
	Id              int64  `json:"id" db:"id"`
	AccountId       string `json:"account_id" db:"account_id"`
	CredentialType  string `json:"credential_type" db:"credential_type"`
	CredentialValue string `json:"credential_value" db:"credential_value"`
	UpdatedAt       string `json:"updated_at" db:"updated_at"`
}

type CredentialsRepo interface {
	GetCredentialsByAccountId(id int) []ThreadsDb_Credential
}

func (client *ThreadsDbAdminClient) GetCredentialsByAccountId(id int) []ThreadsDb_Credential {
	var credentials []ThreadsDb_Credential
	err := client.Db.Select(&credentials, "SELECT * FROM credentials WHERE account_id = ?", id)
	if err != nil {
		fmt.Println("[WARN]: error fetching credentials for account", err)
	}
	return credentials
}
