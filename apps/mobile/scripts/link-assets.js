import fs from 'node:fs';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function ensureDir(dir) {
	fs.mkdirSync(dir, { recursive: true });
}

function copyDir(src, dest) {
	ensureDir(dest);
	fs.cpSync(src, dest, { recursive: true });
}

function emptyDir(dir) {
	if (fs.existsSync(dir)) {
		// remove all contents inside
		const files = fs.readdirSync(dir);
		for (const file of files) {
			const filePath = path.join(dir, file);
			const stat = fs.statSync(filePath);

			if (stat.isDirectory()) {
				fs.rmSync(filePath, { recursive: true, force: true });
			} else {
				fs.unlinkSync(filePath);
			}
		}
	} else {
		fs.mkdirSync(dir, { recursive: true });
	}
}

function linkAssets() {
	// root path
	const root = path.resolve(__dirname, '../../..');

	const assetsSrc = path.join(root, 'apps/_shared/assets');
	const mobileDst = path.join(root, 'apps/mobile/assets');
	const webDst = path.join(root, 'apps/web/public');

	/**
	 * Remove the licensed assets
	 */
	if (!['publish', 'dev'].includes(process.env.APP_VARIANT)) {
		const licensedFolder = path.join(mobileDst, 'licensed');
		emptyDir(licensedFolder);
	}

	ensureDir(mobileDst);
	// mobile
	copyDir(assetsSrc, mobileDst);
	// web
	copyDir(assetsSrc, path.join(webDst, 'assets'));

	console.log('All assets linked successfully ✅');
}

export default linkAssets;
