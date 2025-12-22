import {
	useAppApiClient,
	useAppBottomSheet,
	useAppPublishers,
} from '#/states/global/hooks';
import { usePostComposerState } from '@dhaaga/react';
import AtprotoComposerService from '#/services/atproto/atproto-compose';
import { AtprotoApiAdapter, DriverService, PostParser } from '@dhaaga/bridge';
import { APP_BOTTOM_SHEET_ENUM } from '#/states/global/slices/createBottomSheetSlice';
import { APP_POST_VISIBILITY } from '#/hooks/app/useVisibility';
import { ActivityPubService } from '@dhaaga/bridge';
import { useState } from 'react';

function useComposerCreateAction() {
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

	async function _activityPubCreatePost() {
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
			_activityPubCreatePost();
		}
	}

	return { create, isLoading: Loading };
}

export default useComposerCreateAction;
