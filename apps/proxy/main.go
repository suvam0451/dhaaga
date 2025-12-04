package main

import (
	"context"
	"dhaaga/atproto_subscriber"
	"fmt"
	"log"
	"log/slog"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/joho/godotenv"
)

func Handler(ctx context.Context, request events.LambdaFunctionURLRequest) (events.LambdaFunctionURLResponse, error) {
	path := request.RawPath // "/one" or "/two"

	headers := map[string]string{
		"Content-Type": "application/json",
	}

	switch path {
	case "/one":
		return events.LambdaFunctionURLResponse{
			StatusCode: 200,
			Headers:    headers,
			Body:       `{"message":"Hello from Handler One!"}`,
		}, nil
	case "/two":
		return events.LambdaFunctionURLResponse{
			StatusCode: 200,
			Headers:    headers,
			Body:       `{"message":"Hello from Handler Two!"}`,
		}, nil
	default:
		return events.LambdaFunctionURLResponse{
			StatusCode: 404,
			Headers:    headers,
			Body:       fmt.Sprintf(`{"error":"Route %s not found"}`, path),
		}, nil
	}
}

func main2() {
	lambda.Start(Handler)
}

func main() {
	slog.Info("Starting bot")
	err := godotenv.Load()
	if err != nil {
		slog.Error("Error loading .env file")
	}

	// go func() {
	// 	http.HandleFunc("/health", bot.HealthCheck)
	// 	slog.Info("Starting health check server on :8080")

	// 	if err := http.ListenAndServe(":8080", nil); err != nil {
	// 		log.Fatal("Failed to start health check server:", err)
	// 	}
	// }()

	err = atproto_subscriber.Websocket()
	if err != nil {
		log.Fatal(err)
	}
}
