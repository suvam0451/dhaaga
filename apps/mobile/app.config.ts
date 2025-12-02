import { ExpoConfig, ConfigContext } from '@expo/config';

const APP_NAME = process.env.APP_NAME ?? 'Dhaaga (Lite)';
const BUNDLE_ID = process.env.BUNDLE_IDENTIFIER ?? 'io.suvam.dhaaga.lite';

const expo = ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	name: APP_NAME,
	slug: 'dhaaga',
	version: '0.17.0',
	orientation: 'portrait',
	icon: './assets/dhaaga/icon.png',
	userInterfaceStyle: 'dark',
	scheme: 'dhaaga',
	jsEngine: 'hermes',
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
		versionCode: 34,
		edgeToEdgeEnabled: true,
		blockedPermissions: [
			'android.permission.SYSTEM_ALERT_WINDOW',
			'android.permission.READ_EXTERNAL_STORAGE',
			'android.permission.WRITE_EXTERNAL_STORAGE',
			'android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK',
		],
		// softwareKeyboardLayoutMode: 'pan',
		icon: './assets/dhaaga/icon.png',
		adaptiveIcon: {
			foregroundImage: './assets/dhaaga/adaptive-icon.png',
			backgroundColor: '#e7ce8b',
			monochromeImage: './assets/dhaaga/adaptive-icon.png',
		},
	},
	androidStatusBar: {
		barStyle: 'dark-content',
		backgroundColor: '#e6cf8b',
		translucent: false,
	},
	splash: {
		image: './assets/dhaaga/icon.png',
		resizeMode: 'contain',
		backgroundColor: '#e6cf8b',
	},
	assetBundlePatterns: ['**/*'],
	web: {
		favicon: './assets/dhaaga/favicon.png',
	},
	extra: {
		eas: {
			projectId: '6a318c01-ca78-440f-840f-64c54ddc94fe',
		},
	},
	experiments: {
		reactCanary: true,
	},
	newArchEnabled: true,
	plugins: [
		'expo-sqlite',
		'expo-web-browser',
		'expo-localization',
		'expo-video',
		'expo-router',
		[
			'expo-build-properties',
			{
				android: {
					compileSdkVersion: 36,
					targetSdkVersion: 36,
					buildToolsVersion: '36.1.0',
					enableMinifyInReleaseBuilds: true,
					enableShrinkResourcesInReleaseBuilds: true,
					blockedPermissions: [
						'android.permission.SYSTEM_ALERT_WINDOW',
						'android.permission.READ_EXTERNAL_STORAGE',
						'android.permission.WRITE_EXTERNAL_STORAGE',
						'android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK',
					],
					buildArchs: ['arm64-v8a'],
					enableBundleCompression: true,
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
					// Applicable for flat node_modules (yarn, pnpm with node-linker=hoisted etc.)
					'../../node_modules/@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf',
					'../../node_modules/@expo-google-fonts/inter/500Medium/Inter_500Medium.ttf',
					'../../node_modules/@expo-google-fonts/inter/600SemiBold/Inter_600SemiBold.ttf',
					'../../node_modules/@expo-google-fonts/inter/700Bold/Inter_700Bold.ttf', // Montserrat
					'../../node_modules/@expo-google-fonts/bebas-neue/400Regular/BebasNeue_400Regular.ttf', // BebasNeue
					'../../node_modules/@expo-google-fonts/roboto/400Regular/Roboto_400Regular.ttf', // Roboto
					'../../node_modules/@expo-google-fonts/roboto/500Medium/Roboto_500Medium.ttf',
					'../../node_modules/@expo-google-fonts/roboto/700Bold/Roboto_700Bold.ttf',
					// Applicable for pnpm (when not hoisted)
					// '../../node_modules/.pnpm/@expo-google-fonts+inter@0.2.3/node_modules/@expo-google-fonts/inter/Inter_400Regular.ttf',
					// '../../node_modules/.pnpm/@expo-google-fonts+inter@0.2.3/node_modules/@expo-google-fonts/inter/Inter_500Medium.ttf',
					// '../../node_modules/.pnpm/@expo-google-fonts+inter@0.2.3/node_modules/@expo-google-fonts/inter/Inter_600SemiBold.ttf',
					// '../../node_modules/.pnpm/@expo-google-fonts+inter@0.2.3/node_modules/@expo-google-fonts/inter/Inter_700Bold.ttf', // Montserrat
					// '../../node_modules/.pnpm/@expo-google-fonts+bebas-neue@0.2.3/node_modules/@expo-google-fonts/bebas-neue/BebasNeue_400Regular.ttf', // BebasNeue
					// '../../node_modules/.pnpm/@expo-google-fonts+roboto@0.2.3/node_modules/@expo-google-fonts/roboto/Roboto_400Regular.ttf', // Roboto
					// '../../node_modules/.pnpm/@expo-google-fonts+roboto@0.2.3/node_modules/@expo-google-fonts/roboto/Roboto_500Medium.ttf',
					// '../../node_modules/.pnpm/@expo-google-fonts+roboto@0.2.3/node_modules/@expo-google-fonts/roboto/Roboto_700Bold.ttf',
				],
			},
		],
		[
			'expo-audio',
			{
				microphonePermission: 'Allow Dhaaga to access your microphone.',
			},
		],
		[
			'expo-asset',
			{
				assets: [
					'./assets/dhaaga',
					'./assets/branding',
					'./assets/badges',
					'./assets/licensed',
				],
			},
		],
	],
});

export default expo;
