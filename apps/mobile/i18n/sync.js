/**
 * This script makes sure that the translation source files
 * are fully synced with the English files, and orders the keys
 * alphabetically for convenience
 */

import fs from 'node:fs';
import path from 'node:path';

// Sort JSON keys alphabetically
function sortJsonKeys(jsonData) {
	if (typeof jsonData === 'string') {
		jsonData = JSON.parse(jsonData);
	}

	return JSON.stringify(sortKeysRecursive(jsonData), null, 4);
}

// Helper to recursively sort keys (for nested objects)
function sortKeysRecursive(obj) {
	if (Array.isArray(obj)) {
		return obj.map(sortKeysRecursive);
	} else if (obj !== null && typeof obj === 'object') {
		return Object.keys(obj)
			.sort()
			.reduce((result, key) => {
				result[key] = sortKeysRecursive(obj[key]);
				return result;
			}, {});
	}
	return obj;
}

// Get list of languages
const localesDir = './i18n/locales';
let langs;

try {
	langs = fs.readdirSync(localesDir);
} catch (err) {
	console.error('Locales directory not found.');
	process.exit(1);
}

if (!langs.includes('en')) {
	console.log('No support');
	process.exit(1);
}

langs.forEach((lang) => {
	if (lang === 'en') return;

	const langDir = path.join(localesDir, lang);
	const files = fs
		.readdirSync(langDir)
		.filter((file) => fs.statSync(path.join(langDir, file)).isFile());

	console.log(lang, files);
});
