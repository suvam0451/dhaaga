import {
	StorageAccessFramework,
	readAsStringAsync,
	EncodingType,
	writeAsStringAsync,
	downloadAsync,
	cacheDirectory,
} from 'expo-file-system/legacy';

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
		// Requests permissions for external directory

		const permissions =
			await StorageAccessFramework.requestDirectoryPermissionsAsync();
		if (!permissions.granted)
			return { success: false, error: 'E_Permission_Denied' };

		// 2️⃣ Download the file temporarily in the app sandbox
		const tempFileUri = cacheDirectory + (fileName || 'image.png');
		await downloadAsync(url, tempFileUri);

		// 3️⃣ Create the file in the selected directory
		const fileUri = await StorageAccessFramework.createFileAsync(
			permissions.directoryUri,
			fileName || 'image.png',
			'image/png',
		);

		// 4️⃣ Read the temp file as base64
		// const base64 = await response.bytes();
		const base64 = await readAsStringAsync(tempFileUri, {
			encoding: EncodingType.Base64,
		});

		// 5️⃣ Write base64 to the destination
		await writeAsStringAsync(fileUri, base64, {
			encoding: EncodingType.Base64,
		});

		console.log('Saved to directory:', fileUri);
		return { success: true, uri: fileUri };
		//
		// console.log(permissions.directoryUri);
		// const response = await fetch(url);
		// const src = new File(permissions.directoryUri, fileName || 'image.png');
		// src.write(await response.bytes());
		// console.log('saved to app directory', src);

		// const downloadResumable = createDownloadResumable(
		// 	url,
		// 	cacheDirectory + (fileName || 'image.png'),
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
		// const base64 = await readAsStringAsync(uri, {
		// 	encoding: EncodingType.Base64,
		// });
		// const fileUri = await StorageAccessFramework.createFileAsync(
		// 	permissions.directoryUri,
		// 	fileName || 'image.png',
		// 	'image/png',
		// );
		// await writeAsStringAsync(fileUri, base64, {
		// 	encoding: EncodingType.Base64,
		// });
		return { success: true };
	}
}

export { AppService, AppDownloadService };
