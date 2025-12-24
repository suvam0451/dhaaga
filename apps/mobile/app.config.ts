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
				['expo-iap'],
			];

const NONFREE_PERMS_WHITELIST =
	BUNDLE_ID === 'io.suvam.dhaaga.lite'
		? []
		: ['android.permission.POST_NOTIFICATIONS', 'com.android.vending.BILLING'];

const NONFREE_PERMS_BLACKLIST =
	BUNDLE_ID === 'io.suvam.dhaaga.lite' ? ['android.permission.BILLING'] : [];

const expo = ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	name: APP_NAME,
	slug: 'dhaaga',
	version: '0.19.2',
	orientation: 'portrait',
	icon: './assets/dhaaga/icon.png',
	userInterfaceStyle: 'dark',
	scheme: APP_SCHEME,
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
		version: 'v0.19.2',
		versionCode: 39,
		predictiveBackGestureEnabled: true,
		permissions: [
			'android.permission.INTERNET',
			'android.permission.VIBRATE',
			...NONFREE_PERMS_WHITELIST,
		],
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
			'com.sec.android.provider.badge.permission.WRITE',
			'com.majeur.launcher.permission.UPDATE_BADGE',
			'com.sonyericsson.home.permission.BROADCAST_BADGE',
			'com.sonymobile.home.permission.PROVIDER_INSERT_BADGE',
			'me.everything.badger.permission.BADGE_COUNT_READ',
			'me.everything.badger.permission.BADGE_COUNT_WRITE',
			'com.google.android.finsky.permission.BIND_GET_INSTALL_REFERRER_SERVICE',
			'android.permission.FOREGROUND_SERVICE',
			'android.permission.ACCESS_NETWORK_STATE',
			...NONFREE_PERMS_BLACKLIST,
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
	extra: {
		eas: {
			projectId: '6a318c01-ca78-440f-840f-64c54ddc94fe',
		},
	},
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
					// kotlinVersion: '2.2.0', // pinning causes build errors
					buildToolsVersion: '36.1.0 ',
					enableMinifyInReleaseBuilds: true,
					enableShrinkResourcesInReleaseBuilds: true,
					buildArchs: ['arm64-v8a'],
					enableBundleCompression: true,
					useLegacyPackaging: false,
				},
			},
		],
		[
			'expo-image-picker',
			{
				photosPermission:
					'Dhaaga needs gallery access to support attaching media to your post.',
			},
		],
		[
			'expo-font',
			{
				fonts: [
					'../../node_modules/@expo-google-fonts/bebas-neue/400Regular/BebasNeue_400Regular.ttf', // BebasNeue
				],
			},
		],
		[
			'expo-audio',
			{
				microphonePermission:
					'Allow Dhaaga access to your microphone to be able to create audio posts.',
			},
		],
		[
			'expo-asset',
			{
				assets: [
					'./assets/licensed',
					'./assets/badges',
					'./assets/branding',
					'./assets/dhaaga',
				],
			},
		],
		...NONFREE_DEPS,
	],
});

export default expo;
