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
function stripLicensedAssetUse() {
	if (['publish-apk', 'publish-aab'].includes(process.env.APP_VARIANT)) return;

	fs.renameSync(
		path.join(dir, '../components/containers/WithBackgroundSkin.tsx'),
		path.join(dir, '../components/containers/archived.bak'),
	);

	fs.renameSync(
		path.join(dir, '../components/containers/WithBackgroundSkin.lite.tsx'),
		path.join(dir, '../components/containers/WithBackgroundSkin.tsx'),
	);
}

export default stripLicensedAssetUse;
