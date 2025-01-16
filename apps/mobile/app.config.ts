import { ExpoConfig, ConfigContext } from 'expo/config.js';

const IS_DEV = process.env.APP_VARIANT === 'dev';

const expo = ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	name: IS_DEV ? 'Dhaaga (Dev)' : 'Dhaaga',
	slug: 'dhaaga',
	version: '0.13.0',
	orientation: 'portrait',
	icon: './assets/placeholder_icon.png',
	userInterfaceStyle: 'dark',
	scheme: 'your-app-scheme',
	platforms: ['android'],
	developmentClient: {
		silentLaunch: true,
	},
	ios: {
		bundleIdentifier: IS_DEV ? 'io.suvam.dhaaga.dev' : 'io.suvam.dhaaga.lite',
		supportsTablet: false,
	},
	android: {
		package: IS_DEV ? 'io.suvam.dhaaga.dev' : 'io.suvam.dhaaga.lite',
		versionCode: 21,
	},
	androidStatusBar: {
		barStyle: 'dark-content',
		backgroundColor: '#1c1c1c',
	},
	splash: {
		image: './assets/splash.png',
		resizeMode: 'contain',
		backgroundColor: '#242424',
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
					// Inter
					'../../node_modules/@expo-google-fonts/inter/Inter_400Regular.ttf',
					'../../node_modules/@expo-google-fonts/inter/Inter_500Medium.ttf',
					'../../node_modules/@expo-google-fonts/inter/Inter_600SemiBold.ttf',
					'../../node_modules/@expo-google-fonts/inter/Inter_700Bold.ttf', // Montserrat
					'../../node_modules/@expo-google-fonts/montserrat/Montserrat_400Regular.ttf',
					'../../node_modules/@expo-google-fonts/montserrat/Montserrat_500Medium.ttf',
					'../../node_modules/@expo-google-fonts/montserrat/Montserrat_600SemiBold.ttf',
					'../../node_modules/@expo-google-fonts/montserrat/Montserrat_700Bold.ttf',
					'../../node_modules/@expo-google-fonts/montserrat/Montserrat_800ExtraBold.ttf', // BebasNeue
					'../../node_modules/@expo-google-fonts/bebas-neue/BebasNeue_400Regular.ttf', // Roboto
					'../../node_modules/@expo-google-fonts/roboto/Roboto_400Regular.ttf',
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
