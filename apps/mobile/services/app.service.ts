import * as FileSystem from 'expo-file-system';
import { StorageAccessFramework } from 'expo-file-system';

class AppService {
	/**
	 * Lite edition disabled NonFreeNet
	 * features like server lookup, tenor
	 * and giphy
	 *
	 * It is also used to handle notifications
	 * differently from firebase
	 */
	static isLiteEdition() {
		return process.env.IS_LITE_EDITION || false;
	}
}

class AppDownloadService {
	static async saveToAppDirectory(url: string, fileName?: string) {
		const downloadResumable = FileSystem.createDownloadResumable(
			url,
			FileSystem.cacheDirectory + (fileName || 'image.png'),
			{},
		);
		const { uri } = await downloadResumable.downloadAsync();

		const permissions =
			await StorageAccessFramework.requestDirectoryPermissionsAsync();
		if (!permissions.granted)
			return { success: false, error: 'E_Permission_Denied' };

		// write temporary content to file
		const base64 = await FileSystem.readAsStringAsync(uri, {
			encoding: FileSystem.EncodingType.Base64,
		});
		const fileUri = await StorageAccessFramework.createFileAsync(
			permissions.directoryUri,
			fileName || 'image.png',
			'image/png',
		);
		await FileSystem.writeAsStringAsync(fileUri, base64, {
			encoding: FileSystem.EncodingType.Base64,
		});
		return { success: true };
	}
}

export { AppService, AppDownloadService };
