import { ExpoConfig, ConfigContext } from '@expo/config';

const APP_NAME = process.env.APP_NAME ?? 'Dhaaga (Lite)';
const BUNDLE_ID = process.env.BUNDLE_IDENTIFIER ?? 'io.suvam.dhaaga.lite';
const APP_SCHEME = process.env.APP_SCHEME ?? 'dhaaga-lite';

const NONFREE_DEPS: ([] | [string] | [string, any])[] =
	BUNDLE_ID === 'io.suvam.dhaaga.lite'
		? []
		: [
				[
					'expo-notifications',
					{
						icon: './assets/dhaaga/icon.png',
						color: '#e6cf8b',
						defaultChannel: 'default',
						sounds: [],
						enableBackgroundRemoteNotifications: false,
					},
				],
			];

const expo = ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	name: APP_NAME,
	slug: 'dhaaga',
	version: '0.18.0',
	orientation: 'portrait',
	icon: './assets/dhaaga/icon.png',
	userInterfaceStyle: 'dark',
	scheme: APP_SCHEME,
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
		version: 'v0.18.0',
		versionCode: 36,
		edgeToEdgeEnabled: true,
		predictiveBackGestureEnabled: true,
		blockedPermissions: [
			'android.permission.SYSTEM_ALERT_WINDOW',
			'android.permission.READ_EXTERNAL_STORAGE',
			'android.permission.WRITE_EXTERNAL_STORAGE',
			'android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK',
			'android.permission.RECORD_AUDIO',
			'android.permission.CAMERA',
			'android.permission.MODIFY_AUDIO_SETTINGS',
			'android.permission.READ_APP_BADGE',
			'android.permission.RECEIVE_BOOT_COMPLETED',
			'android.permission.WAKE_LOCK',
			'com.anddoes.launcher.permission.UPDATE_COUNT',
			'com.google.android.c2dm.permission.RECEIVE',
			'com.android.vending.permission.BIND_GET_INSTALL_REFERRER_SERVICE',
			'com.htc.launcher.permission.READ_SETTINGS',
			'com.htc.launcher.permission.UPDATE_SHORTCUT',
			'com.huawei.android.launcher.permission.READ_SETTINGS',
			'com.huawei.android.launcher.permission.WRITE_SETTINGS',
			'com.huawei.android.launcher.permission.CHANGE_BADGE',
			'com.oppo.launcher.permission.READ_SETTINGS',
			'com.oppo.launcher.permission.WRITE_SETTINGS',
			'android.permission.BADGE_READ',
			'android.permission.BADGE_WRITE',
			'com.sec.android.provider.badge.READ',
			'com.sec.android.provider.badge.WRITE',
			'com.sec.android.provider.badge.permission.READ',
			'com.sec.android.provider.badge.permission.READ',
			'com.majeur.launcher.permission.UPDATE_BADGE',
			'com.sonyericsson.home.permission.BROADCAST_BADGE',
			'com.sonymobile.home.permission.PROVIDER_INSERT_BADGE',
			'me.everything.badger.permission.BADGE_COUNT_READ',
			'me.everything.badger.permission.BADGE_COUNT_WRITE',
			'com.google.android.finsky.permission.BIND_GET_INSTALL_REFERRER_SERVICE',
			'android.permission.FOREGROUND_SERVICE',
		],
		// softwareKeyboardLayoutMode: 'pan',
		icon: './assets/dhaaga/icon.png',
		adaptiveIcon: {
			foregroundImage: './assets/dhaaga/adaptive_fg.png',
			backgroundImage: './assets/dhaaga/adaptive_bg.png',
			monochromeImage: './assets/dhaaga/adaptive_mc.png',
			backgroundColor: '#e6cf8b',
		},
		softwareKeyboardLayoutMode: 'pan',
	},
	androidStatusBar: {
		barStyle: 'dark-content',
		backgroundColor: '#e6cf8b',
		translucent: true,
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
			'expo-splash-screen',
			{
				backgroundColor: '#e6cf8b',
			},
		],
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
		...NONFREE_DEPS,
	],
});

export default expo;
