// Learn more https://docs.expo.dev/guides/monorepos
const { getDefaultConfig } = require('expo/metro-config');
const { FileStore } = require('metro-cache');
const path = require('node:path');

// Create the default Expo config for Metro
// This includes the automatic monorepo configuration for workspaces
// See: https://docs.expo.dev/guides/monorepos/#automatic-configuration
const config = getDefaultConfig(__dirname);

// bundle sqlite files
// config.resolver.sourceExts.push('sql');

// Use turborepo to restore the cache when possible
config.cacheStores = [
	new FileStore({
		root: path.join(__dirname, 'node_modules', '.cache', 'metro'),
	}),
];

module.exports = config;
