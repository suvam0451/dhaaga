import { memo } from 'react';
import { APP_FONT, APP_THEME } from '../../../../../styles/AppTheme';
import { Text, TouchableOpacity } from 'react-native';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import { FontAwesome } from '@expo/vector-icons';
import { useComposerContext } from '../api/useComposerContext';
import { APP_POST_VISIBILITY } from '../../../../../hooks/app/useVisibility';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';
import { useAppBottomSheet } from '../../_api/useAppBottomSheet';
import ActivityPubAdapterService from '../../../../../services/activitypub-adapter.service';
import ActivityPubService from '../../../../../services/activitypub.service';
import { PostMiddleware } from '../../../../../services/middlewares/post.middleware';
import AtprotoComposerService, {
	AtprotoReplyEmbed,
} from '../../../../../services/atproto/atproto-compose';
import useGlobalState, {
	APP_BOTTOM_SHEET_ENUM,
} from '../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

/**
 * Click to Post!
 */
const PostButton = memo(() => {
	const { rawText, mediaTargets, visibility, cw } = useComposerContext();
	const { client, driver, acct } = useGlobalState(
		useShallow((o) => ({
			client: o.router,
			driver: o.driver,
			acct: o.acct,
		})),
	);
	const { setType, ParentRef, PostRef } = useAppBottomSheet();

	async function onClick() {
		let _visibility: any = visibility.toLowerCase();

		if (driver === KNOWN_SOFTWARE.BLUESKY) {
			let reply: AtprotoReplyEmbed = null;
			if (ParentRef.current) {
				if (ParentRef.current.rootPost) {
					// both parent and root available
					reply = {
						root: {
							uri: ParentRef.current.rootPost.meta.uri,
							cid: ParentRef.current.rootPost.meta.cid,
						},
						parent: {
							uri: ParentRef.current.meta.uri,
							cid: ParentRef.current.meta.cid,
						},
					};
				} else {
					// parent must be root
					reply = {
						root: {
							uri: ParentRef.current.meta.uri,
							cid: ParentRef.current.meta.cid,
						},
						parent: {
							uri: ParentRef.current.meta.uri,
							cid: ParentRef.current.meta.cid,
						},
					};
				}
			}
			const data = await AtprotoComposerService.post(client as any, rawText, {
				reply,
			});
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

		if (visibility === APP_POST_VISIBILITY.PRIVATE) {
			_visibility = ActivityPubService.mastodonLike(driver)
				? 'private'
				: 'followers';
		}
		if (visibility === APP_POST_VISIBILITY.UNLISTED) {
			_visibility = ActivityPubService.mastodonLike(driver)
				? 'unlisted'
				: 'home';
		}
		if (visibility === APP_POST_VISIBILITY.DIRECT) {
			_visibility = ActivityPubService.mastodonLike(driver)
				? 'direct'
				: 'specified';
		}
		const { data, error } = await client.statuses.create({
			status: rawText,
			visibleUserIds: [],
			mastoVisibility: _visibility,
			misskeyVisibility: _visibility,
			language: 'en',
			sensitive: false,
			inReplyToId: ParentRef.current ? ParentRef.current.id : null,
			mediaIds: mediaTargets.map((o) => o.remoteId.toString()),
			localOnly: false,
			spoilerText: cw === '' ? undefined : cw,
		});
		if (!error) console.log('resounding success...');

		if (
			[
				KNOWN_SOFTWARE.MASTODON,
				KNOWN_SOFTWARE.PLEROMA,
				KNOWN_SOFTWARE.AKKOMA,
			].includes(driver)
		) {
			const _data = ActivityPubAdapterService.adaptStatus(data, driver);

			try {
				PostRef.current = new PostMiddleware(
					_data,
					driver,
					acct?.server,
				).export();
			} catch (e) {
				console.log(e);
			}
		} else {
			try {
				PostRef.current = new PostMiddleware(
					ActivityPubAdapterService.adaptStatus(
						(data as any).createdNote,
						driver,
					),
					driver,
					acct?.server,
				).export();
			} catch (e) {
				console.log(e);
			}
		}
		setType(APP_BOTTOM_SHEET_ENUM.STATUS_PREVIEW);
	}

	return (
		<TouchableOpacity
			style={{
				backgroundColor: APP_THEME.REPLY_THREAD_COLOR_SWATCH[0],
				flexDirection: 'row',
				alignItems: 'center',
				paddingHorizontal: 12,
				borderRadius: 8,
				paddingVertical: 6,
			}}
			onPress={onClick}
		>
			<Text
				style={{
					color: APP_FONT.MONTSERRAT_BODY,
					fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
				}}
			>
				Post
			</Text>
			<FontAwesome
				name="send"
				size={20}
				style={{ marginLeft: 8 }}
				color={APP_FONT.MONTSERRAT_BODY}
			/>
		</TouchableOpacity>
	);
});

export default PostButton;
