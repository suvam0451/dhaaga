import {
	PostComposerAction,
	usePostComposerDispatch,
	usePostComposerState,
} from '@dhaaga/react';
import { useAppApiClient, useAppDialog } from '#/states/global/hooks';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';

function useAltText() {
	const state = usePostComposerState();
	const dispatch = usePostComposerDispatch();
	const { client, driver } = useAppApiClient();
	const { show } = useAppDialog();

	/**
	 * For mastodon compatible servers, the
	 * alt text needs to be post-processed
	 * @param idx
	 * @param text
	 */
	async function _processAltText(idx: number, text: string) {
		if (text == '') return;
		if (state.medias.length <= idx) {
			return;
		}
		const _media = state.medias[idx];
		try {
			const { error } = await client.media.updateDescription(
				_media.remoteId,
				text,
			);
			if (error) {
				dispatch({
					type: PostComposerAction.SET_ALT_TEXT_SYNC_STATUS,
					payload: {
						index: idx,
						status: 'failed',
					},
				});
			} else {
				dispatch({
					type: PostComposerAction.SET_ALT_TEXT_SYNC_STATUS,
					payload: {
						index: idx,
						status: 'uploaded',
					},
				});
			}
		} catch (e) {
			dispatch({
				type: PostComposerAction.SET_ALT_TEXT_SYNC_STATUS,
				payload: {
					index: idx,
					status: 'failed',
				},
			});
		}
	}

	async function setAltText(mediaAttachmentIndex: number, text: string) {
		console.log('setAltText', mediaAttachmentIndex, text);
		dispatch({
			type: PostComposerAction.SET_ALT_TEXT,
			payload: {
				index: mediaAttachmentIndex,
				text,
			},
		});

		// for bluesky, media assets are not preloaded
		if (driver === KNOWN_SOFTWARE.BLUESKY) return;

		dispatch({
			type: PostComposerAction.SET_ALT_TEXT_SYNC_STATUS,
			payload: {
				index: mediaAttachmentIndex,
				status: 'uploading',
			},
		});
		await _processAltText(mediaAttachmentIndex, text);
	}

	function showDialog(mediaAttachmentIndex: number) {
		show(
			{
				title: 'Alt Text',
				actions: [],
				description: [
					'See alt text for this image.',
					'Submit empty string to remove.',
				],
			},
			{
				$type: 'text-prompt',
				placeholder: 'Enter new alt text',
				userInput: state.medias[mediaAttachmentIndex].localAlt,
			},
			(ctx) => {
				if (ctx.$type !== 'text-prompt') return;
				setAltText(mediaAttachmentIndex, ctx.userInput.trim());
			},
		);
	}

	return { showDialog };
}

export default useAltText;
