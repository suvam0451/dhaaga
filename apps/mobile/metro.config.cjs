// Learn more https://docs.expo.dev/guides/monorepos
const { getDefaultConfig } = require('expo/metro-config');
const { FileStore } = require('metro-cache');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// #1 - Watch all files in the monorepo
config.watchFolders = [workspaceRoot];
// #3 - Force resolving nested modules to the folders below
config.resolver.disableHierarchicalLookup = true;
// #2 - Try resolving with project modules first, then workspace modules
config.resolver.nodeModulesPaths = [
	path.resolve(projectRoot, 'node_modules'),
	path.resolve(workspaceRoot, 'node_modules'),
];
config.resolver.sourceExts.push('sql');

// config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'cjs', 'json'] //add here
// config.transformer.getTransformOptions = async () => ({
//   transform: {
//     experimentalImportSupport: false,
//     inlineRequires: true,
//   },
// })

// Use turborepo to restore the cache when possible
config.cacheStores = [
	new FileStore({
		root: path.join(projectRoot, 'node_modules', '.cache', 'metro'),
	}),
];

/**
 * Move the Metro cache to the `node_modules/.cache/metro` folder.
 * This repository configured Turborepo to use this cache location as well.
 * If you have any environment variables, you can configure Turborepo to invalidate it when needed.
 *
 * @see https://turbo.build/repo/docs/reference/configuration#env
 * @param {import('expo/metro-config').MetroConfig} config
 * @returns {import('expo/metro-config').MetroConfig}
 */
function withTurborepoManagedCache(config) {
	config.cacheStores = [
		new FileStore({ root: path.join(__dirname, 'node_modules/.cache/metro') }),
	];
	return config;
}

/**
 * Add the monorepo paths to the Metro config.
 * This allows Metro to resolve modules from the monorepo.
 *
 * @see https://docs.expo.dev/guides/monorepos/#modify-the-metro-config
 * @param {import('expo/metro-config').MetroConfig} config
 * @returns {import('expo/metro-config').MetroConfig}
 */
function withMonorepoPaths(config) {
	const projectRoot = __dirname;
	const workspaceRoot = path.resolve(projectRoot, '../..');

	// #1 - Watch all files in the monorepo
	config.watchFolders = [workspaceRoot];

	// #2 - Resolve modules within the project's `node_modules` first, then all monorepo modules
	config.resolver['nodeModulesPaths'] = [
		path.resolve(projectRoot, 'node_modules'),
		path.resolve(workspaceRoot, 'node_modules'),
	];

	return config;
}

module.exports = withTurborepoManagedCache(withMonorepoPaths(config));
module.exports = config;
