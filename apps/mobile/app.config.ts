import { ExpoConfig, ConfigContext } from 'expo/config.js';

const IS_DEV = process.env.APP_VARIANT === 'dev';

const expo = ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	name: IS_DEV ? 'Dhaaga (Dev)' : 'Dhaaga',
	slug: 'dhaaga',
	version: '0.4.0',
	orientation: 'portrait',
	icon: './assets/placeholder_icon.png',
	userInterfaceStyle: 'dark',
	scheme: 'your-app-scheme',
	platforms: ['android'],
	developmentClient: {
		silentLaunch: true,
	},
	ios: {
		bundleIdentifier: IS_DEV ? 'io.suvam.dhaaga.dev' : 'io.suvam.dhaaga',
		supportsTablet: false,
	},
	android: {
		package: IS_DEV ? 'io.suvam.dhaaga.dev' : 'io.suvam.dhaaga',
		versionCode: 4,
		// adaptiveIcon: {
		// 	foregroundImage: './assets/adaptive-logo.png',
		// 	backgroundColor: '#ffffff',
		// },
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
					enableProguardInReleaseBuilds: false,
					enableShrinkResourcesInReleaseBuilds: false,
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
		[
			'expo-av',
			{
				microphonePermission:
					'Dhaaga needs microphone access to support audio attachments.',
			},
		],
	],
});

export default expo;
