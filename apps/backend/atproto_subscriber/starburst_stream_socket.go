package atproto_subscriber

import (
	"bytes"
	"io"
	"log/slog"

	"github.com/fxamacker/cbor/v2"
	"github.com/gorilla/websocket"
)

type RepoCommitEvent struct {
	Repo   string      `cbor:"repo"`
	Rev    string      `cbor:"rev"`
	Seq    int64       `cbor:"seq"`
	Since  string      `cbor:"since"`
	Time   string      `cbor:"time"`
	TooBig bool        `cbor:"tooBig"`
	Prev   interface{} `cbor:"prev"`
	Rebase bool        `cbor:"rebase"`
	Blocks []byte      `cbor:"blocks"`

	Ops []RepoOperation `cbor:"ops"`
}

type RepoOperation struct {
	Action string      `cbor:"action"`
	Path   string      `cbor:"path"`
	Reply  *Reply      `cbor:"reply"`
	Text   []byte      `cbor:"text"`
	CID    interface{} `cbor:"cid"`
}

type Reply struct {
	Parent Parent `json:"parent"`
	Root   Root   `json:"root"`
}

type Parent struct {
	Cid string `json:"cid"`
	Uri string `json:"uri"`
}

type Root struct {
	Cid string `json:"cid"`
	Uri string `json:"uri"`
}

type Post struct {
	Type  string `json:"$type"`
	Text  string `json:"text"`
	Reply *Reply `json:"reply"`
}

func Websocket() error {
	var wsURL = "wss://bsky.network/xrpc/com.atproto.sync.subscribeRepos"
	conn, _, err := websocket.DefaultDialer.Dial(wsURL, nil)
	if err != nil {
		slog.Error("Failed to connect to WebSocket", "error", err)
		return err
	}
	defer conn.Close()

	slog.Info("Connected to WebSocket", "url", wsURL)

	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			slog.Error("Error reading message from WebSocket", "error", err)
			continue
		}

		decoder := cbor.NewDecoder(bytes.NewReader(message))

		for {
			var evt RepoCommitEvent
			err := decoder.Decode(&evt)
			if err == io.EOF {
				break
			}
			if err != nil {
				slog.Error("Error decoding CBOR message", "error", err)
				break
			}
		}
	}
}
