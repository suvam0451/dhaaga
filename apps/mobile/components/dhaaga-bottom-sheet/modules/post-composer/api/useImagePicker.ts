import * as ImagePicker from 'expo-image-picker';
import { useComposerContext } from './useComposerContext';
import { useActivityPubRestClientContext } from '../../../../../states/useActivityPubRestClient';
import ActivityPubProviderService from '../../../../../services/activitypub-provider.service';
import { useCallback } from 'react';
import { AccountMetadataService } from '../../../../../database/entities/account-metadata';
import { useSQLiteContext } from 'expo-sqlite';

function useImagePicker() {
	const { primaryAcct, subdomain, domain } = useActivityPubRestClientContext();
	const { addMediaTarget } = useComposerContext();
	const db = useSQLiteContext();

	const trigger = useCallback(async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			quality: 1,
		});

		if (!result.canceled) {
			let _url = result.assets[0].uri;

			const token = AccountMetadataService.getKeyValueForAccountSync(
				db,
				primaryAcct,
				'access_token',
			);

			try {
				const uploadResult = await ActivityPubProviderService.uploadFile(
					subdomain,
					_url,
					{
						token: token,
						mimeType: result.assets[0].mimeType,
						domain,
					},
				);

				addMediaTarget({
					localUri: _url,
					uploaded: true,
					remoteId: uploadResult.id,
					previewUrl: uploadResult.previewUrl,
				});
			} catch (E) {
				console.log(E);
			}
		}
	}, [addMediaTarget, primaryAcct]);

	return { trigger };
}

export default useImagePicker;
