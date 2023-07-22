import {
	GetCustomDeviceId,
	SetCustomDeviceId,
} from "../../wailsjs/go/main/App";

export class UserSettingsService {
	static async getCustomDeviceId(): Promise<string | null> {
		try {
			return await GetCustomDeviceId();
		} catch (e) {
			return null;
		}
	}

	static async setCustomDeviceId(deviceId: string): Promise<boolean> {
		try {
			const res = await SetCustomDeviceId(deviceId);
			return res;
		} catch (e) {
			return false;
		}
	}
}
