import * as ImagePicker from 'expo-image-picker';
import { useComposerContext } from './useComposerContext';
import { useActivityPubRestClientContext } from '../../../../../states/useActivityPubRestClient';
import ActivityPubProviderService from '../../../../../services/activitypub-provider.service';
import AccountRepository from '../../../../../repositories/account.repo';
import { useRealm } from '@realm/react';
import { useCallback } from 'react';

function useImagePicker() {
	const { primaryAcct, subdomain, domain } = useActivityPubRestClientContext();
	const { addMediaTarget } = useComposerContext();
	const db = useRealm();

	const trigger = useCallback(async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
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
	}, [addMediaTarget, db, primaryAcct]);

	return { trigger };
}

export default useImagePicker;
