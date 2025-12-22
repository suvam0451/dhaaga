import { execSync } from 'node:child_process';
import stripLicensedAssetUse from './strip-licensed-asset-use.js';
import linkAssets from './link-assets.js';

function run(cmd) {
	execSync(cmd, { stdio: 'inherit' });
}

run('npm run eas-build-pre-install');

linkAssets();
stripLicensedAssetUse();
