import { memo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import { FontAwesome } from '@expo/vector-icons';
import { useComposerContext } from '../api/useComposerContext';
import { APP_POST_VISIBILITY } from '../../../../../hooks/app/useVisibility';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { useAppBottomSheet } from '../../_api/useAppBottomSheet';
import ActivityPubAdapterService from '../../../../../services/activitypub-adapter.service';
import ActivityPubService from '../../../../../services/activitypub.service';
import { PostMiddleware } from '../../../../../services/middlewares/post.middleware';
import AtprotoComposerService, {
	AtprotoReplyEmbed,
} from '../../../../../services/atproto/atproto-compose';
import useGlobalState from '../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import {
	useAppBottomSheet_Improved,
	useAppPublishers,
	useAppTheme,
} from '../../../../../hooks/utility/global-state-extractors';
import { APP_BOTTOM_SHEET_ENUM } from '../../../Core';
import { Loader } from '../../../../lib/Loader';

/**
 * Click to Post!
 */
const PostButton = memo(() => {
	const [Loading, setLoading] = useState(false);
	const { state } = useComposerContext();
	const { client, driver, acct } = useGlobalState(
		useShallow((o) => ({
			client: o.router,
			driver: o.driver,
			acct: o.acct,
		})),
	);
	const { theme } = useAppTheme();
	const { setType, PostRef } = useAppBottomSheet();
	const { postPub } = useAppPublishers();
	const { show, setCtx } = useAppBottomSheet_Improved();

	async function onClick() {
		setLoading(true);
		let _visibility: any = state.visibility;

		if (driver === KNOWN_SOFTWARE.BLUESKY) {
			let reply: AtprotoReplyEmbed = null;
			// if (ParentRef.current) {
			// if (ParentRef.current.rootPost) {
			// 	// both parent and root available
			// 	reply = {
			// 		root: {
			// 			uri: ParentRef.current.rootPost.meta.uri,
			// 			cid: ParentRef.current.rootPost.meta.cid,
			// 		},
			// 		parent: {
			// 			uri: ParentRef.current.meta.uri,
			// 			cid: ParentRef.current.meta.cid,
			// 		},
			// 	};
			// } else {
			// 	// parent must be root
			// 	reply = {
			// 		root: {
			// 			uri: ParentRef.current.meta.uri,
			// 			cid: ParentRef.current.meta.cid,
			// 		},
			// 		parent: {
			// 			uri: ParentRef.current.meta.uri,
			// 			cid: ParentRef.current.meta.cid,
			// 		},
			// 	};
			// }
			// }
			const data = await AtprotoComposerService.post(
				client as any,
				state.text,
				{
					reply,
				},
			);
			if (data) {
				/**
				 * 	FIXME: Currently only shows the latest record
				 * 		We can use the logic from context builder
				 * 		to render the parent and root, as well
				 */
				const res = ActivityPubAdapterService.adaptStatus(data, driver);
				PostRef.current = new PostMiddleware(
					res,
					driver,
					acct?.server,
				).export();
				setType(APP_BOTTOM_SHEET_ENUM.STATUS_PREVIEW);
				return;
			}
		}

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
			const { data, error } = await client.statuses.create({
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
			if (error) throw new Error(error.message);
			console.log('resounding success...');

			if (ActivityPubService.mastodonLike(driver)) {
				const _data = PostMiddleware.deserialize(data, driver, acct?.server);
				postPub.writeCache(_data.uuid, _data);
				setCtx({ uuid: _data.uuid });
				show(APP_BOTTOM_SHEET_ENUM.POST_PREVIEW, true);
			} else {
				const _data = PostMiddleware.deserialize<unknown>(
					(data as any).createdNote,
					driver,
					acct?.server,
				);
				postPub.writeCache(_data.uuid, _data);
				setCtx({ uuid: _data.uuid });
				show(APP_BOTTOM_SHEET_ENUM.POST_PREVIEW, true);
			}
		} catch (e) {
		} finally {
			setLoading(false);
		}
	}

	if (Loading)
		return (
			<View style={{ paddingHorizontal: 24 }}>
				<Loader />
			</View>
		);

	return (
		<TouchableOpacity
			style={{
				backgroundColor: theme.primary.a0,
				flexDirection: 'row',
				alignItems: 'center',
				paddingHorizontal: 12,
				borderRadius: 8,
				paddingVertical: 8,
			}}
			onPress={onClick}
		>
			<Text
				style={{
					color: 'black',
					fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
				}}
			>
				Post
			</Text>
			<FontAwesome
				name="send"
				size={20}
				style={{ marginLeft: 8 }}
				color={'black'}
			/>
		</TouchableOpacity>
	);
});

export default PostButton;
