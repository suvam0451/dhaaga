import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { fetch } from 'expo/fetch';
import { File } from 'expo-file-system';

/**
 * Wrapper service to invoke provider functions
 */
class ActivityPubProviderService {
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
					const file = new File(fileUri);
					const formData = new FormData();
					formData.append('file', file);
					const response = await fetch(`https://${subdomain}/api/v2/media`, {
						method: 'POST',
						body: formData,
						headers: {
							'Content-Type': 'multipart/form-data',
							Authorization: `Bearer ${token}`,
						},
					});

					const _dt = await response.json();
					return { id: _dt['id'], previewUrl: _dt['preview_url'] };
				} catch (e) {
					console.log(e);
					return null;
				}
			}
			case KNOWN_SOFTWARE.PLEROMA:
			case KNOWN_SOFTWARE.AKKOMA: {
				try {
					const file = new File(fileUri);
					const formData = new FormData();
					formData.append('file', file);
					const response = await fetch(`https://${subdomain}/api/v1/media`, {
						method: 'POST',
						body: formData,
						headers: {
							'Content-Type': 'multipart/form-data',
							Authorization: `Bearer ${token}`,
						},
						// mimeType: mimeType,
					});

					const _dt = await response.json();
					return { id: _dt['id'], previewUrl: _dt['preview_url'] };
				} catch (e) {
					console.log(e);
					return null;
				}
			}
			case KNOWN_SOFTWARE.MISSKEY:
			default: {
				try {
					const file = new File(fileUri);
					const formData = new FormData();
					formData.append('file', file);
					const response = await fetch(
						`https://${subdomain}/api/drive/files/create`,
						{
							method: 'POST',
							body: formData,
							headers: {
								'Content-Type': 'multipart/form-data',
								Authorization: `Bearer ${token}`,
							},
							// mimeType: mimeType,
						},
					);

					const _dt = await response.json();
					return { id: _dt['id'], previewUrl: _dt['thumbnailUrl'] };
				} catch (e) {
					console.log(e);
					return null;
				}
			}
		}
	}
}

export default ActivityPubProviderService;
