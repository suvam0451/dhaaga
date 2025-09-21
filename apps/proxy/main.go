package main

import (
	"context"
	"fmt"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
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

func main() {
	lambda.Start(Handler)
}
