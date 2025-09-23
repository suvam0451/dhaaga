// deploy.js
import { execSync } from 'node:child_process';
import fs from 'node:fs';

const BINARY_NAME = 'bootstrap';
const PROJECT_NAME = 'DhaagaProxyServices';
const FUNCTION_NAME = 'DhaagaProxyService';
const STACK_NAME = `${PROJECT_NAME}-stack`;

function run(command, options = {}) {
	try {
		execSync(command, { stdio: 'inherit', ...options });
	} catch (err) {
		console.error(`Error executing: ${command}`);
		process.exit(1);
	}
}

function remove(pathToRemove) {
	if (fs.existsSync(pathToRemove)) {
		fs.rmSync(pathToRemove, { recursive: true, force: true });
		console.log(`Removed: ${pathToRemove}`);
	}
}

function deploy() {
	// 1️⃣ Build
	console.log('Building binaries...');
	run(`GOOS=linux GOARCH=arm64 go build -o ${BINARY_NAME} main.go`);

	// 2️⃣ Deploy
	console.log('Deploying Lambda using SAM...');
	run(`sam deploy --stack-name ${STACK_NAME} --no-confirm-changeset`);

	// 3️⃣ Fetch Function URL
	try {
		const url = execSync(
			`aws lambda list-function-url-configs --function-name ${FUNCTION_NAME} --query 'FunctionUrlConfigs[0].FunctionUrl' --output text`,
		)
			.toString()
			.trim();
		console.log(`Your Lambda Function URL: ${url}`);
	} catch {
		console.warn('Could not fetch Lambda Function URL.');
	}

	// 4️⃣ Cleanup
	console.log('Cleaning build artifacts...');
	remove('.aws-sam');
	remove(BINARY_NAME);
}

// Execute deploy
deploy();
