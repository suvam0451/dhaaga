import {
	PostComposerAction,
	usePostComposerDispatch,
	usePostComposerState,
} from '@dhaaga/react';
import {
	useAppApiClient,
	useAppBottomSheet,
	useAppDialog,
	useAppPublishers,
} from '#/states/global/hooks';
import { useState } from 'react';
import AtprotoComposerService from '#/services/atproto/atproto-compose';
import {
	ActivityPubService,
	AtprotoApiAdapter,
	DriverService,
	KNOWN_SOFTWARE,
	PostParser,
} from '@dhaaga/bridge';
import { APP_BOTTOM_SHEET_ENUM } from '#/states/global/slices/createBottomSheetSlice';
import { APP_POST_VISIBILITY } from '#/hooks/app/useVisibility';

export function useThreadGate() {
	const State = usePostComposerState();
	const dispatch = usePostComposerDispatch();
	const { show } = useAppDialog();

	function onPress() {
		show({
			title: 'Limit Interaction',
			description: ['Set who can reply to this post.'],
			actions: [
				{
					label: 'Everybody',
					variant: 'switch',
					onPress: async () => {
						dispatch({
							type: PostComposerAction.THREADGATE_SET_ALL,
						});
					},
					selected: State.threadGates.length === 0,
				},
				{
					label: 'Nobody',
					variant: 'switch',
					onPress: async () => {
						dispatch({
							type: PostComposerAction.THREADGATE_SET_NONE,
						});
					},
					selected: State.threadGates.includes('nobody'),
				},
				{
					label: 'Your Followers',
					variant: 'switch',
					onPress: async () => {
						dispatch({
							type: PostComposerAction.THREADGATE_SET_FOLLOWERS,
						});
					},
					selected: State.threadGates.includes('followers'),
				},
				{
					label: 'People you Follow',
					variant: 'switch',
					onPress: async () => {
						dispatch({
							type: PostComposerAction.THREADGATE_SET_FOLLOWEES,
						});
					},
					selected: State.threadGates.includes('following'),
				},
				{
					label: 'People you Mention',
					variant: 'switch',
					onPress: async () => {
						dispatch({
							type: PostComposerAction.THREADGATE_SET_MENTIONED,
						});
					},
					selected: State.threadGates.includes('mentioned'),
				},
			],
		});
	}

	return { onPress };
}

export function usePostComposerInputMode() {
	const dispatch = usePostComposerDispatch();

	function toTextMode() {
		dispatch({
			type: PostComposerAction.SWITCH_TO_TEXT_TAB,
		});
	}

	function toMediaMode() {}

	function toEmojiMode() {}

	function toGifMode() {}

	return { toTextMode, toMediaMode, toEmojiMode, toGifMode };
}

export function usePostExecutor() {
	const [Loading, setLoading] = useState(false);

	const { postEventBus } = useAppPublishers();
	const { client, driver, server } = useAppApiClient();
	const { show } = useAppBottomSheet();

	const state = usePostComposerState();

	async function _atProtoCreatePost() {
		setLoading(true);
		const _post = await AtprotoComposerService.postUsingReducerState(
			client as AtprotoApiAdapter,
			state,
		);

		if (!_post) {
			setLoading(false);
			return;
		}

		/**
		 * 	FIXME: Currently only shows the latest record
		 * 		We can use the logic from context builder
		 * 		to render the parent and root, as well
		 */
		const _newPostObject = PostParser.parse<unknown>(_post, driver, server);
		postEventBus.write(_newPostObject.uuid, _newPostObject);
		show(APP_BOTTOM_SHEET_ENUM.POST_PREVIEW, true, {
			$type: 'post-preview',
			postId: _newPostObject.id,
		});
		setLoading(false);
	}

	async function activityPubCreatePost() {
		let _visibility: any = state.visibility;

		switch (_visibility) {
			case APP_POST_VISIBILITY.PUBLIC: {
				_visibility = ActivityPubService.mastodonLike(driver)
					? 'public'
					: 'public';
				break;
			}
			case APP_POST_VISIBILITY.PRIVATE: {
				_visibility = ActivityPubService.mastodonLike(driver)
					? 'private'
					: 'followers';
				break;
			}
			case APP_POST_VISIBILITY.UNLISTED: {
				_visibility = ActivityPubService.mastodonLike(driver)
					? 'unlisted'
					: 'home';
				break;
			}
			case APP_POST_VISIBILITY.DIRECT: {
				_visibility = ActivityPubService.mastodonLike(driver)
					? 'direct'
					: 'specified';
				break;
			}
		}

		try {
			const data = await client.posts.create({
				status: state.text,
				visibleUserIds: [],
				mastoVisibility: _visibility,
				misskeyVisibility: _visibility,
				language: 'en',
				sensitive: false,
				inReplyToId: state.parent ? state.parent.id : null,
				mediaIds: state.medias.map((o) => o.remoteId),
				localOnly: false,
				spoilerText: state.cw === '' ? undefined : state.cw,
			});

			if (ActivityPubService.mastodonLike(driver)) {
				const _data = PostParser.parse(data, driver, server);
				postEventBus.write(_data.uuid, _data);
				show(APP_BOTTOM_SHEET_ENUM.POST_PREVIEW, true, {
					$type: 'post-preview',
					postId: _data.id,
				});
			} else if (DriverService.supportsMisskeyApi(driver)) {
				const _data = PostParser.parse<unknown>(
					(data as any).createdNote,
					driver,
					server,
				);
				postEventBus.write(_data.uuid, _data);
				show(APP_BOTTOM_SHEET_ENUM.POST_PREVIEW, true, {
					$type: 'post-preview',
					postId: _data.id,
				});
			}
		} catch (e) {
		} finally {
			setLoading(false);
		}
	}

	function create() {
		if (DriverService.supportsAtProto(client.driver)) {
			_atProtoCreatePost();
		} else {
			activityPubCreatePost();
		}
	}

	return { create, isLoading: Loading };
}

export function useAltText() {
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
