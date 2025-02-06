import { ExpoConfig, ConfigContext } from 'expo/config.js';

const IS_DEV = process.env.APP_VARIANT === 'dev';

// Replace "Dhaaga" with "Dhaaga (Lite)" for Lite edition
const APP_NAME = IS_DEV ? 'Dhaaga (Dev)' : 'Dhaaga';
const BUNDLE_ID = IS_DEV ? 'io.suvam.dhaaga.dev' : 'io.suvam.dhaaga';

const expo = ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	name: APP_NAME,
	slug: 'dhaaga',
	version: '0.15.3',
	orientation: 'portrait',
	icon: './assets/icon.png',
	userInterfaceStyle: 'dark',
	scheme: 'dhaaga',
	platforms: ['android'],
	developmentClient: {
		silentLaunch: true,
	},
	ios: {
		bundleIdentifier: BUNDLE_ID,
		supportsTablet: false,
	},
	android: {
		package: BUNDLE_ID,
		versionCode: 28,
		blockedPermissions: [
			'android.permission.SYSTEM_ALERT_WINDOW',
			'android.permission.READ_EXTERNAL_STORAGE',
			'android.permission.WRITE_EXTERNAL_STORAGE',
			'android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK',
		],
		icon: './assets/icon.png',
		adaptiveIcon: {
			foregroundImage: './assets/adaptive-icon.png',
			backgroundColor: '#e7ce8b',
			monochromeImage: './assets/adaptive-icon.png',
		},
	},
	androidStatusBar: {
		barStyle: 'dark-content',
		backgroundColor: '#e6cf8b',
	},
	splash: {
		image: './assets/icon.png',
		resizeMode: 'contain',
		backgroundColor: '#e6cf8b',
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
	newArchEnabled: true,
	plugins: [
		'expo-sqlite',
		[
			'expo-build-properties',
			{
				android: {
					compileSdkVersion: 35,
					targetSdkVersion: 35,
					buildToolsVersion: '35.0.0',
					newArchEnabled: true,
					enableProguardInReleaseBuilds: false,
					enableShrinkResourcesInReleaseBuilds: false,
					blockedPermissions: [
						'android.permission.SYSTEM_ALERT_WINDOW',
						'android.permission.READ_EXTERNAL_STORAGE',
						'android.permission.WRITE_EXTERNAL_STORAGE',
						'android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK',
					],
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
		[
			'expo-font',
			{
				fonts: [
					// Inter
					'../../node_modules/@expo-google-fonts/inter/Inter_400Regular.ttf',
					'../../node_modules/@expo-google-fonts/inter/Inter_500Medium.ttf',
					'../../node_modules/@expo-google-fonts/inter/Inter_600SemiBold.ttf',
					'../../node_modules/@expo-google-fonts/inter/Inter_700Bold.ttf', // Montserrat
					'../../node_modules/@expo-google-fonts/bebas-neue/BebasNeue_400Regular.ttf', // BebasNeue
					'../../node_modules/@expo-google-fonts/roboto/Roboto_400Regular.ttf', // Roboto
					'../../node_modules/@expo-google-fonts/roboto/Roboto_500Medium.ttf',
					'../../node_modules/@expo-google-fonts/roboto/Roboto_700Bold.ttf',
				],
			},
		],
		['expo-localization'],
		['expo-video'],
		[
			'expo-asset',
			{
				assets: ['./assets/icons', './assets/licensed'],
			},
		],
		['expo-router'],
	],
});

export default expo;
