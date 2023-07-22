package threadsapi

type ThreadsApi_Private_TextFeed_Profile struct {
	// medias []ThreadsApi_Media `json:"medias"`
	Threads   []ThreadsApi_Thread `json:"threads"`
	NextMaxId string              `json:"next_max_id"`
	Status    string              `json:"status"`
}
