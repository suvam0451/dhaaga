import { ActivityPubClient } from '@dhaaga/shared-abstraction-activitypub';
import * as FileSystem from 'expo-file-system';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';

/**
 * Wrapper service to invoke provider functions
 */
class ActivityPubProviderService {
	static async getStatusContext(client: ActivityPubClient, id: string) {
		return client.statuses.getContext(id);
	}

	static async getStatus(client: ActivityPubClient, id: string) {
		return client.statuses.get(id);
	}

	static async getStatusAsArray(client: ActivityPubClient, id: string) {
		const status = await client.statuses.get(id);
		return [status];
	}

	static async uploadFile(
		subdomain: string,
		fileUri: string,
		{
			token,
			mimeType,
			domain,
		}: {
			token: string;
			mimeType: string;
			domain: string;
		},
	): Promise<{ id: string; previewUrl: string } | null> {
		switch (domain) {
			case KNOWN_SOFTWARE.MASTODON: {
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
					const _dt = JSON.parse(data.body);
					return { id: _dt['id'], previewUrl: _dt['preview_url'] };
				} catch (e) {
					console.log(e);
					return null;
				}
			}
			default: {
				try {
					const data = await FileSystem.uploadAsync(
						`https://${subdomain}/api/drive/files/create`,
						fileUri,
						{
							headers: {
								'Content-Type': 'multipart/form-data',
								// Authorization: `Bearer ${token}`,
							},
							fieldName: 'file',
							uploadType: FileSystem.FileSystemUploadType.MULTIPART,
							mimeType: mimeType,
							parameters: {
								i: token,
							},
						},
					);
					const _dt = JSON.parse(data.body);
					return {
						id: _dt['id'],
						previewUrl: _dt['thumbnailUrl'],
					};
				} catch (e) {
					console.log(e);
					return null;
				}
			}
		}
	}
}

export default ActivityPubProviderService;
