import * as ImagePicker from 'expo-image-picker';
import { useComposerContext } from './useComposerContext';
import { useActivityPubRestClientContext } from '../../../../../states/useActivityPubRestClient';
import ActivityPubProviderService from '../../../../../services/activitypub-provider.service';
import AccountRepository from '../../../../../repositories/account.repo';
import { useRealm } from '@realm/react';

// Function to convert a local URI to a Blob
async function localUrlToBlob(uri: string) {
	// Handle Android-specific file URI scheme
	// const adjustedUri = Platform.OS === 'android' && uri.startsWith('file://')
	// 	? uri.replace('file://', '')
	// 	: uri;

	// Fetch the file data from the URI
	const response = await fetch(uri);
	// Convert response to Blob
	return await response.blob();
}

function useImagePicker() {
	const { client, primaryAcct, domain, subdomain } =
		useActivityPubRestClientContext();
	const { addMediaTarget } = useComposerContext();
	const db = useRealm();

	async function trigger() {
		// No permissions request is necessary for launching the image library
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			// allowsEditing: true,
			// aspect: [4, 3],
			quality: 1,
		});

		if (!result.canceled) {
			let _url = result.assets[0].uri;

			const token = AccountRepository.findSecret(
				db,
				primaryAcct,
				'access_token',
			)?.value;

			try {
				const uploadResult = await ActivityPubProviderService.uploadFile(
					subdomain,
					_url,
					{
						token: token,
						mimeType: result.assets[0].mimeType,
					},
				);

				addMediaTarget({
					localUri: _url,
					uploaded: true,
					remoteId: uploadResult['id'],
					previewUrl: uploadResult['preview_url'],
				});
				console.log(uploadResult);
			} catch (E) {
				console.log(E);
			}
		}
	}

	return { trigger };
}

export default useImagePicker;
