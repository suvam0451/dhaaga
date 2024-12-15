import * as ImagePicker from 'expo-image-picker';
import { useComposerContext } from './useComposerContext';
import ActivityPubProviderService from '../../../../../services/activitypub-provider.service';
import { useCallback } from 'react';
import { AccountMetadataService } from '../../../../../database/entities/account-metadata';
import useGlobalState from '../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

function useImagePicker() {
	const { acct, driver, db } = useGlobalState(
		useShallow((o) => ({
			acct: o.acct,
			driver: o.driver,
			db: o.db,
		})),
	);
	const { addMediaTarget } = useComposerContext();

	const trigger = useCallback(async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			quality: 1,
		});

		if (!result.canceled) {
			let _url = result.assets[0].uri;

			const token = AccountMetadataService.getKeyValueForAccountSync(
				db,
				acct,
				'access_token',
			);

			try {
				const uploadResult = await ActivityPubProviderService.uploadFile(
					acct?.server,
					_url,
					{
						token: token,
						mimeType: result.assets[0].mimeType,
						domain: driver,
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
	}, [addMediaTarget, acct]);

	return { trigger };
}

export default useImagePicker;
