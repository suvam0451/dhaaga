package threadsdb

// Firstload will run any pending migrations for this db
func Firstload() {
	// data db
	dbClient := ThreadsDbClient{}
	dbClient.LoadDatabase()
	dbClient.InitializeSchema()
	defer dbClient.CloseDatabase()

	// admin db
	dbAdminClient := ThreadsDbAdminClient{}
	dbAdminClient.LoadDatabase()
	dbAdminClient.InitializeSchema()
	defer dbAdminClient.CloseDatabase()
}
