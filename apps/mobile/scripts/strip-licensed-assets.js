import fs from 'node:fs';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dir = __dirname;

/**
 * Strips references to licensed assets
 * used in the play store version so that
 * metro bundler does not throw an error
 */
function stripLicensedAssets() {
	if (!['skinned', 'dev'].includes(process.env.APP_VARIANT))
		fs.renameSync(
			path.join(dir, 'WithBackgroundSkin.tsx'),
			path.join(dir, 'archived.bak'),
		);

	fs.renameSync(
		path.join(dir, 'WithBackgroundSkin.lite.tsx'),
		path.join(dir, 'WithBackgroundSkin.tsx'),
	);
}

export default stripLicensedAssets;
