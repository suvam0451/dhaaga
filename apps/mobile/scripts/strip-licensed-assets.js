import fs from 'node:fs';
import path from 'node:path';

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
