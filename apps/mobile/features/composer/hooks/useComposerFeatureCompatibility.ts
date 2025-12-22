import {
	useActiveUserSession,
	useAppApiClient,
	useAppDb,
} from '#/states/global/hooks';
import { DriverService } from '@dhaaga/bridge';
import {
	PostComposerAction,
	usePostComposerDispatch,
	usePostComposerState,
} from '@dhaaga/react';
import { ACCOUNT_METADATA_KEY, AccountMetadataService } from '@dhaaga/db';
import MediaUtils from '#/utils/media.utils';
import ActivityPubProviderService from '#/services/activitypub-provider.service';

export function useComposerFeatureCompatibility() {
	const { driver } = useAppApiClient();
	return {
		canAttachMedia: true,
		canAttachVideo: false,
		supportsContentWarning: !DriverService.supportsAtProto(driver),
		supportsCustomEmojis:
			DriverService.supportsPleromaApi(driver) ||
			DriverService.supportsMisskeyApi(driver),
		canUseGif: false,
	};
}

export function useComposerModes() {
	const dispatch = usePostComposerDispatch();
	function onPressMediaTab() {
		dispatch({
			type: PostComposerAction.SWITCH_TO_MEDIA_TAB,
		});
	}

	function onPressEmojiTab() {
		dispatch({
			type: PostComposerAction.SWITCH_TO_EMOJI_TAB,
		});
	}

	function onPressContentWarningButton() {
		dispatch({
			type: PostComposerAction.TOGGLE_CW_SECTION_SHOWN,
		});
	}

	return {
		onPressMediaTab,
		onPressEmojiTab,
		onPressContentWarningButton,
	};
}

export function useComposerPostVisibility() {
	const State = usePostComposerState();

	return { label: State.visibility };
}

export function useComposerMediaAttachments() {
	const dispatch = usePostComposerDispatch();
	const { db } = useAppDb();
	const { acct } = useActiveUserSession();
	const { driver } = useAppApiClient();

	/**
	 * Lets the user select an image item
	 * to share and starts and updates about
	 * upload status
	 */
	async function trigger() {
		let _asset = await MediaUtils.pickImageFromDevice();
		if (!_asset) return;

		const token = AccountMetadataService.getKeyValueForAccountSync(
			db,
			acct,
			ACCOUNT_METADATA_KEY.ACCESS_TOKEN,
		);

		dispatch({
			type: PostComposerAction.ADD_MEDIA,
			payload: {
				item: _asset,
			},
		});

		// media attachments are uploaded during post-creation
		if (DriverService.supportsAtProto(driver)) return;

		// try upload
		try {
			dispatch({
				type: PostComposerAction.SET_UPLOAD_STATUS,
				payload: {
					status: 'uploading',
					localUri: _asset.uri,
				},
			});
			const uploadResult = await ActivityPubProviderService.uploadFile(
				acct?.server,
				_asset.uri,
				{
					token,
					mimeType: _asset.mimeType,
					domain: driver,
				},
			);
			if (uploadResult.id && uploadResult.previewUrl) {
				dispatch({
					type: PostComposerAction.SET_UPLOAD_STATUS,
					payload: {
						status: 'uploaded',
						localUri: _asset.uri,
					},
				});
				dispatch({
					type: PostComposerAction.SET_REMOTE_CONTENT,
					payload: {
						localUri: _asset.uri,
						remoteId: uploadResult.id,
						previewUrl: uploadResult.previewUrl,
					},
				});
			} else {
				dispatch({
					type: PostComposerAction.SET_UPLOAD_STATUS,
					payload: {
						status: 'failed',
						localUri: _asset.uri,
					},
				});
			}
		} catch (E) {
			dispatch({
				type: PostComposerAction.SET_UPLOAD_STATUS,
				payload: {
					status: 'failed',
					localUri: _asset.uri,
				},
			});
		}
	}

	return { trigger };
}
