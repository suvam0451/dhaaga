import { ExpoConfig, ConfigContext } from 'expo/config';

const IS_DEV = process.env.APP_VARIANT === 'dev';

const expo = ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	name: IS_DEV ? 'Dhaaga (Dev)' : 'Dhaaga',
	slug: 'dhaaga',
	version: '0.0.1',
	orientation: 'portrait',
	icon: './assets/placeholder_icon.png',
	userInterfaceStyle: 'dark',
	scheme: 'your-app-scheme',
	platforms: ['android'],
	developmentClient: {
		silentLaunch: true,
	},
	ios: {
		bundleIdentifier: IS_DEV ? 'com.suvam.dhaaga-dev' : 'com.suvam.dhaaga',
		supportsTablet: false,
	},
	android: {
		package: IS_DEV ? 'com.suvam.dhaaga-dev' : 'com.suvam.dhaaga',
		adaptiveIcon: {
			foregroundImage: './assets/adaptive-icon.png',
			backgroundColor: '#ffffff',
		},
	},
	splash: {
		image: './assets/splash.png',
		resizeMode: 'contain',
		backgroundColor: '#ffffff',
	},
	assetBundlePatterns: ['**/*'],
	web: {
		favicon: './assets/favicon.png',
	},
	extra: {
		eas: {
			projectId: '6a318c01-ca78-440f-840f-64c54ddc94fe',
		},
	},
	plugins: [
		[
			'expo-build-properties',
			{
				ios: {
					newArchEnabled: true,
				},
				android: {
					newArchEnabled: true,
				},
			},
		],
		[
			'expo-image-picker',
			{
				photosPermission:
					'Dhaaga needs gallery access to support media attachments.',
			},
		],
		['expo-font'],
		['expo-localization'],
		['expo-video'],
		[
			'expo-asset',
			{
				assets: ['./assets/icons'],
			},
		],
		['expo-router'],
	],
});

export default expo;
