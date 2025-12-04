import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { loadExpoNotification } from '#/nonfree/_loaders';

export async function registerForPushNotificationsAsync(): Promise<
	string | null
> {
	const Notifications = await loadExpoNotification();
	if (!Notifications) return null;

	let token: string | null = null;
	if (Platform.OS === 'android') {
		await Notifications.setNotificationChannelAsync('DhaagaAppNotifications', {
			name: 'A channel is needed for the permissions prompt to appear',
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: '#FF231F7C',
		});
	}

	if (!Device.isDevice) {
		alert('Must use physical device for Push Notifications');
		return null;
	}

	if (Device.isDevice) {
		const { status: existingStatus } =
			await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;
		if (existingStatus !== 'granted') {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}
		if (finalStatus !== 'granted') {
			alert('Failed to get push token for push notification!');
			return;
		}
		// Learn more about projectId:
		// https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
		// EAS projectId is used here.
		try {
			const projectId =
				Constants?.expoConfig?.extra?.eas?.projectId ??
				Constants?.easConfig?.projectId;
			if (!projectId) {
				throw new Error('Project ID not found');
			}
			token = (
				await Notifications.getExpoPushTokenAsync({
					projectId,
				})
			).data;
			console.log(token);
		} catch (e) {
			token = `${e}`;
		}
	} else {
		alert('Must use physical device for Push Notifications');
	}

	return token;
}
