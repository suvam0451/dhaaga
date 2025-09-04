import fs, { rmSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';

// ----------------------
function switchToLiteEdition() {
	const TARGET = './app.config.ts';
	let content = fs.readFileSync(TARGET, 'utf8');

	content = content.replace(
		"const BUNDLE_ID = IS_DEV ? 'io.suvam.dhaaga.dev' : 'io.suvam.dhaaga'",
		"const BUNDLE_ID = IS_DEV ? 'io.suvam.dhaaga.dev' : 'io.suvam.dhaaga.lite'",
	);

	fs.writeFileSync(TARGET, content);
}

switchToLiteEdition();

// ----------------------
// Step 0: Remove android folder

function removeAndroidFolder() {
	const androidPath = './android';
	if (existsSync(androidPath)) {
		rmSync(androidPath, { recursive: true, force: true });
		console.log('🗑️  Removed ./android directory');
	} else {
		console.log('⚠️  ./android directory does not exist, skipping removal');
	}
}

removeAndroidFolder();

// Run the prebuild command
try {
	execSync('npx expo prebuild --platform=android', { stdio: 'inherit' });
} catch (err) {
	console.error('Failed to run expo prebuild:', err.message);
}

// ----------------------

function tweakGradleProperties() {
	const TARGET = './android/gradle.properties';
	let content = fs.readFileSync(TARGET, 'utf8');

	content = content.replace(
		'reactNativeArchitectures=armeabi-v7a,arm64-v8a,x86,x86_64',
		'reactNativeArchitectures=arm64-v8a',
	);

	content = content.replace(
		'expo.useLegacyPackaging=false',
		'expo.useLegacyPackaging=true',
	);

	fs.writeFileSync(TARGET, content);
}

tweakGradleProperties();

// ----------------------

function fixApplicationId() {
	const TARGET = './android/app/build.gradle';
	let content = fs.readFileSync(TARGET, 'utf8');

	content = content.replace(
		"applicationId 'io.suvam.dhaaga'",
		"applicationId 'io.suvam.dhaaga.lite'",
	);

	fs.writeFileSync(TARGET, content);
}

fixApplicationId();

// ----------------------

function disableDependencyInfo() {
	const TARGET = './android/app/build.gradle';
	const CONTENT = `    dependenciesInfo {
        // Disables dependency metadata when building APKs.
        includeInApk = false
        // Disables dependency metadata when building Android App Bundles.
        includeInBundle = false
    }\n`;

	const lines = fs.readFileSync(TARGET, 'utf8').split('\n');

	const androidBlockIndex = lines.findIndex((line) =>
		line.includes('android {'),
	);
	if (androidBlockIndex !== -1) {
		const alreadyExists = lines
			.slice(androidBlockIndex)
			.some((line) => line.includes('dependenciesInfo {'));

		if (!alreadyExists) {
			lines.splice(androidBlockIndex + 1, 0, CONTENT);
			fs.writeFileSync(TARGET, lines.join('\n'));
		}
	}
}

disableDependencyInfo();

// ----------------------

function changeAppName() {
	const TARGET = './android/app/src/main/res/values/strings.xml';
	let content = fs.readFileSync(TARGET, 'utf8');

	content = content.replace(
		'name="app_name">Dhaaga</string>',
		'name="app_name">Dhaaga (Lite)</string>',
	);

	fs.writeFileSync(TARGET, content);
}

changeAppName();

// ----------------------

function addSigningKey() {
	const BASE64_SOURCE = process.env.LITE_EDITION_SIGNING_KEY;
	const KEY_STORE_PASSWORD = process.env.KEY_STORE_PASSWORD;
	const KEY_ALIAS = process.env.KEY_ALIAS;
	const KEY_PASSWORD = process.env.KEY_PASSWORD;

	const OUTPUT_FILE = './android/app/dhaaga-lite.keystore';
	const GRADLE_FILE = './android/app/build.gradle';

	if (!BASE64_SOURCE || !KEY_STORE_PASSWORD || !KEY_ALIAS || !KEY_PASSWORD)
		return;

	const fileData = Buffer.from(BASE64_SOURCE, 'base64');
	fs.writeFileSync(OUTPUT_FILE, fileData);

	let content = fs.readFileSync(GRADLE_FILE, 'utf8');

	content = content.replace(
		"storeFile file('debug.keystore')",
		"storeFile file('dhaaga-lite.keystore')",
	);

	content = content.replace(
		"storePassword 'android'",
		`storePassword '${KEY_STORE_PASSWORD}'`,
	);

	content = content.replace(
		"keyAlias 'androiddebugkey'",
		`keyAlias '${KEY_ALIAS}'`,
	);

	content = content.replace(
		"keyPassword 'android'",
		`keyPassword '${KEY_PASSWORD}'`,
	);

	fs.writeFileSync(GRADLE_FILE, content);

	console.log('Signing files written');
}

addSigningKey();

console.log('ALL DONE!');

// ----------------------

// ----------------------
// Optional (commented out in original):
// execSync('bun add -D @react-native-community/cli');
// execSync('npx react-native build-android --mode=release');
// execSync('cd android && ./gradlew assembleRelease');
// execSync('bun remove @react-native-community/cli');
