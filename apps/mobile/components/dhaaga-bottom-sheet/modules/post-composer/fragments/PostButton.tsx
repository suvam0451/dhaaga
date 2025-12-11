import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { APP_FONTS } from '#/styles/AppFonts';
import { FontAwesome } from '@expo/vector-icons';
import { useComposerCtx } from '#/features/composer/contexts/useComposerCtx';
import { APP_POST_VISIBILITY } from '#/hooks/app/useVisibility';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { ActivityPubService } from '@dhaaga/bridge';
import AtprotoComposerService from '#/services/atproto/atproto-compose';
import {
	useAppApiClient,
	useAppBottomSheet,
	useAppPublishers,
	useAppTheme,
} from '#/states/global/hooks';
import { Loader } from '../../../../lib/Loader';
import { AtprotoApiAdapter } from '@dhaaga/bridge';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { useTranslation } from 'react-i18next';
import { PostParser } from '@dhaaga/bridge';
import { APP_BOTTOM_SHEET_ENUM } from '#/states/global/slices/createBottomSheetSlice';

/**
 * Click to Post!
 */
function PostButton() {
	const [Loading, setLoading] = useState(false);
	const { state } = useComposerCtx();
	const { client, driver, server } = useAppApiClient();
	const { theme } = useAppTheme();
	const { postObjectActions } = useAppPublishers();
	const { show, setCtx } = useAppBottomSheet();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	async function onClick() {
		setLoading(true);
		let _visibility: any = state.visibility;
		if (driver === KNOWN_SOFTWARE.BLUESKY) {
			const newPost = await AtprotoComposerService.postUsingReducerState(
				client as AtprotoApiAdapter,
				state,
			);

			if (!newPost) {
				setLoading(false);
				return;
			}

			/**
			 * 	FIXME: Currently only shows the latest record
			 * 		We can use the logic from context builder
			 * 		to render the parent and root, as well
			 */
			const _newPostObject = PostParser.parse<unknown>(newPost, driver, server);
			postObjectActions.write(_newPostObject.uuid, _newPostObject);
			setCtx({ uuid: _newPostObject.uuid });
			show(APP_BOTTOM_SHEET_ENUM.POST_PREVIEW, true);
			setLoading(false);
			return;
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
			const { data, error } = await client.posts.create({
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

			if (ActivityPubService.mastodonLike(driver)) {
				const _data = PostParser.parse(data, driver, server);
				postObjectActions.write(_data.uuid, _data);
				setCtx({ uuid: _data.uuid });
				show(APP_BOTTOM_SHEET_ENUM.POST_PREVIEW, true);
			} else {
				const _data = PostParser.parse<unknown>(
					(data as any).createdNote,
					driver,
					server,
				);
				postObjectActions.write(_data.uuid, _data);
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
				{t(`composer.quickPostSubmit`)}
			</Text>
			<FontAwesome
				name="send"
				size={20}
				style={{ marginLeft: 8 }}
				color={'black'}
			/>
		</TouchableOpacity>
	);
}

export default PostButton;
