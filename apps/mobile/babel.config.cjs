process.env.EXPO_ROUTER_APP_ROOT = './app';

/** @type {import('@babel/core').ConfigFunction} */
module.exports = function(api) {
	api.cache(true);
	return {
		presets: ['babel-preset-expo']
	};
};
