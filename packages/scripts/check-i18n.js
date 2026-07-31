import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.join(__dirname, '../../apps/mobile/i18n/locales');
const enDir = path.join(localesDir, 'en');

function getKeys(obj, prefix = '') {
	let keys = [];
	for (const key in obj) {
		const newKey = prefix ? `${prefix}.${key}` : key;
		if (
			typeof obj[key] === 'object' &&
			obj[key] !== null &&
			!Array.isArray(obj[key])
		) {
			keys = keys.concat(getKeys(obj[key], newKey));
		} else {
			keys.push(newKey);
		}
	}
	return keys;
}

function loadJson(filePath) {
	try {
		return JSON.parse(fs.readFileSync(filePath, 'utf8'));
	} catch (e) {
		console.error(`Error reading ${filePath}: ${e.message}`);
		process.exit(1);
	}
}

const enFiles = fs.readdirSync(enDir);
const locales = fs.readdirSync(localesDir).filter((f) => f !== 'en');

let hasErrors = false;

for (const locale of locales) {
	const localeDir = path.join(localesDir, locale);
	for (const file of enFiles) {
		const enFilePath = path.join(enDir, file);
		const localeFilePath = path.join(localeDir, file);

		if (!fs.existsSync(localeFilePath)) {
			console.error(`Missing file: ${locale}/${file}`);
			hasErrors = true;
			continue;
		}

		const enData = loadJson(enFilePath);
		const localeData = loadJson(localeFilePath);

		const enKeys = getKeys(enData);
		const localeKeys = getKeys(localeData);

		for (const key of enKeys) {
			if (!localeKeys.includes(key)) {
				console.error(`Missing key: ${key} in ${locale}/${file}`);
				hasErrors = true;
			}
		}
	}
}

if (hasErrors) {
	process.exit(1);
} else {
	console.log('All translations match English!');
	process.exit(0);
}
