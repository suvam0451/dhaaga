import { fetch } from 'expo/fetch';
import { File, Paths } from 'expo-file-system';

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
		const response = await fetch(url);
		const src = new File(Paths.cache, fileName || 'image.png');
		src.write(await response.bytes());

		// const downloadResumable = FileSystem.createDownloadResumable(
		// 	url,
		// 	FileSystem.cacheDirectory + (fileName || 'image.png'),
		// 	{},
		// );
		// const { uri } = await downloadResumable.downloadAsync();
		//
		// const permissions =
		// 	await StorageAccessFramework.requestDirectoryPermissionsAsync();
		// if (!permissions.granted)
		// 	return { success: false, error: 'E_Permission_Denied' };
		//
		// // write temporary content to file
		// const base64 = await FileSystem.readAsStringAsync(uri, {
		// 	encoding: FileSystem.EncodingType.Base64,
		// });
		// const fileUri = await StorageAccessFramework.createFileAsync(
		// 	permissions.directoryUri,
		// 	fileName || 'image.png',
		// 	'image/png',
		// );
		// await FileSystem.writeAsStringAsync(fileUri, base64, {
		// 	encoding: FileSystem.EncodingType.Base64,
		// });
		return { success: true };
	}
}

export { AppService, AppDownloadService };
