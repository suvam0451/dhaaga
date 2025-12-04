export async function loadExpoDevice(): Promise<
	typeof import('expo-device') | null
> {
	// --- Dynamic import (safe) ---
	try {
		return await import('expo-device');
	} catch (err) {
		console.warn('expo-device not installed');
		return null;
	}
}

export async function loadExpoNotification(): Promise<
	typeof import('expo-notifications') | null
> {
	// --- Dynamic import (safe) ---
	try {
		return await import('expo-notifications');
	} catch (err) {
		console.warn('expo-notifications not installed');
		return null;
	}
}
