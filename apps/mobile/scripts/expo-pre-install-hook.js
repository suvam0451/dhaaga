import { execSync } from 'node:child_process';
import stripLicensedAssets from '#/scripts/strip-licensed-assets.js';

function run(cmd) {
	execSync(cmd, { stdio: 'inherit' });
}

run('npm run eas-build-pre-install');

stripLicensedAssets();
