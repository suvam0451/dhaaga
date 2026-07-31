import { execSync } from 'node:child_process';

const requiredTools = [
	'node',
	'npm',
	'git',
	'eas',
	'adb',
	'sdkmanager',
	'java',
];

function checkTool(tool) {
	try {
		// Use 'command -v' as it is more POSIX-compliant than 'which'
		execSync(`command -v ${tool}`, { stdio: 'ignore' });
		console.log(`✅ ${tool} is installed.`);
		return true;
	} catch (e) {
		console.error(`❌ ${tool} is NOT installed or not in PATH.`);
		return false;
	}
}

function checkEnvVar(varName) {
	if (process.env[varName]) {
		console.log(`✅ ${varName} is set.`);
		return true;
	} else {
		console.error(`❌ ${varName} is NOT set.`);
		return false;
	}
}

console.log('Checking development environment...');
let allGood = true;
for (const tool of requiredTools) {
	if (!checkTool(tool)) {
		allGood = false;
	}
}

if (!checkEnvVar('ANDROID_HOME')) {
	allGood = false;
}

if (!allGood) {
	console.error(
		'\nSome required tools/environment variables are missing. Please install/set them.\nNOTE: adb is optional. You can use a physical device.',
	);
	process.exit(1);
} else {
	console.log('\nAll required tools are present.');
	process.exit(0);
}
