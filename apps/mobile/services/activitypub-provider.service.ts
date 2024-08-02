import { ActivityPubClient } from '@dhaaga/shared-abstraction-activitypub';
import * as FileSystem from 'expo-file-system';

/**
 * Wrapper service to invoke provider functions
 */
class ActivityPubProviderService {
	static async getStatusContext(client: ActivityPubClient, id: string) {
		return client.statuses.getContext(id);
	}

	static async getStatus(client: ActivityPubClient, id: string) {
		return client.getStatus(id);
	}

	static async getStatusAsArray(client: ActivityPubClient, id: string) {
		const status = await client.getStatus(id);
		return [status];
	}

	static async uploadFile(
		subdomain: string,
		fileUri: string,
		{ token, mimeType }: { token: string; mimeType: string },
	) {
		try {
			const data = await FileSystem.uploadAsync(
				`https://${subdomain}/api/v2/media`,
				fileUri,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
						Authorization: `Bearer ${token}`,
					},
					fieldName: 'file',
					uploadType: FileSystem.FileSystemUploadType.MULTIPART,
					mimeType: mimeType,
				},
			);
			return JSON.parse(data.body);
		} catch (e) {
			console.log(e);
			return null;
		}
	}
}

export default ActivityPubProviderService;
