import { ExpoConfig, ConfigContext } from 'expo/config.js';

const IS_DEV = process.env.APP_VARIANT === 'dev';
const IS_LITE = process.env.APP_VARIANT === 'lite';

const appId = IS_DEV
	? 'io.suvam.dhaaga.dev'
	: IS_LITE
		? 'io.suvam.dhaaga.lite'
		: 'io.suvam.dhaaga';
const appName = IS_DEV ? 'Dhaaga (Dev)' : IS_LITE ? 'Dhaaga (Lite)' : 'Dhaaga';

const expo = ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	name: appName,
	slug: 'dhaaga',
	version: '0.7.0',
	orientation: 'portrait',
	icon: './assets/placeholder_icon.png',
	userInterfaceStyle: 'dark',
	scheme: 'your-app-scheme',
	platforms: ['android'],
	developmentClient: {
		silentLaunch: true,
	},
	ios: {
		bundleIdentifier: appId,
		supportsTablet: false,
	},
	android: {
		package: IS_DEV ? 'io.suvam.dhaaga.dev' : 'io.suvam.dhaaga',
		versionCode: 9,
	},
	androidStatusBar: {
		barStyle: 'dark-content',
		backgroundColor: '#1c1c1c',
	},
	splash: {
		image: './assets/splash.png',
		resizeMode: 'contain',
		backgroundColor: '#121212',
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
					blockedPermissions: [
						'android.permission.SYSTEM_ALERT_WINDOW',
						'android.permission.READ_EXTERNAL_STORAGE',
						'android.permission.WRITE_EXTERNAL_STORAGE',
						'android.permission.RECORD_AUDIO',
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
					'../../node_modules/@expo-google-fonts/inter/Inter_100Thin.ttf',
					'../../node_modules/@expo-google-fonts/inter/Inter_200ExtraLight.ttf',
					'../../node_modules/@expo-google-fonts/inter/Inter_300Light.ttf',
					'../../node_modules/@expo-google-fonts/inter/Inter_400Regular.ttf',
					'../../node_modules/@expo-google-fonts/inter/Inter_500Medium.ttf',
					'../../node_modules/@expo-google-fonts/inter/Inter_600SemiBold.ttf',
					'../../node_modules/@expo-google-fonts/inter/Inter_700Bold.ttf',
					'../../node_modules/@expo-google-fonts/inter/Inter_800ExtraBold.ttf',
					'../../node_modules/@expo-google-fonts/inter/Inter_900Black.ttf',
					// Montserrat
					'../../node_modules/@expo-google-fonts/montserrat/Montserrat_100Thin.ttf',
					'../../node_modules/@expo-google-fonts/montserrat/Montserrat_200ExtraLight.ttf',
					'../../node_modules/@expo-google-fonts/montserrat/Montserrat_300Light.ttf',
					'../../node_modules/@expo-google-fonts/montserrat/Montserrat_400Regular.ttf',
					'../../node_modules/@expo-google-fonts/montserrat/Montserrat_500Medium.ttf',
					'../../node_modules/@expo-google-fonts/montserrat/Montserrat_600SemiBold.ttf',
					'../../node_modules/@expo-google-fonts/montserrat/Montserrat_700Bold.ttf',
					'../../node_modules/@expo-google-fonts/montserrat/Montserrat_800ExtraBold.ttf',
					'../../node_modules/@expo-google-fonts/montserrat/Montserrat_900Black.ttf',
				],
			},
		],
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
