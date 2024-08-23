import { memo } from 'react';
import { APP_FONT, APP_THEME } from '../../../../../styles/AppTheme';
import { Text, TouchableOpacity } from 'react-native';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import { FontAwesome } from '@expo/vector-icons';
import { useComposerContext } from '../api/useComposerContext';
import { useActivityPubRestClientContext } from '../../../../../states/useActivityPubRestClient';
import { APP_POST_VISIBILITY } from '../../../../../hooks/app/useVisibility';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';
import {
	BOTTOM_SHEET_ENUM,
	useAppBottomSheet,
} from '../../_api/useAppBottomSheet';
import ActivityPubAdapterService from '../../../../../services/activitypub-adapter.service';
import { ActivitypubStatusService } from '../../../../../services/ap-proto/activitypub-status.service';

const PostButton = memo(() => {
	const { rawText, mediaTargets, visibility, cw } = useComposerContext();
	const { client, domain, subdomain } = useActivityPubRestClientContext();
	const { setType, PostRef, replyToRef } = useAppBottomSheet();

	async function onClick() {
		let _visibility: any = visibility.toLowerCase();
		if (visibility === APP_POST_VISIBILITY.PRIVATE) {
			_visibility =
				domain === KNOWN_SOFTWARE.MASTODON ? 'private' : 'followers';
		}
		if (visibility === APP_POST_VISIBILITY.UNLISTED) {
			_visibility = domain === KNOWN_SOFTWARE.MASTODON ? 'unlisted' : 'home';
		}
		if (visibility === APP_POST_VISIBILITY.DIRECT) {
			_visibility = domain === KNOWN_SOFTWARE.MASTODON ? 'direct' : 'specified';
		}
		const { data, error } = await client.statuses.create({
			status: rawText,
			visibleUserIds: [],
			mastoVisibility: _visibility,
			misskeyVisibility: _visibility,
			language: 'en',
			sensitive: false,
			inReplyToId: replyToRef.current ? replyToRef.current.id : null,
			mediaIds: mediaTargets.map((o) => o.remoteId.toString()),
			localOnly: false,
			spoilerText: cw === '' ? undefined : cw,
		});

		if (
			[
				KNOWN_SOFTWARE.MASTODON,
				KNOWN_SOFTWARE.PLEROMA,
				KNOWN_SOFTWARE.AKKOMA,
			].includes(domain as any)
		) {
			PostRef.current = new ActivitypubStatusService(
				ActivityPubAdapterService.adaptStatus(data, domain),
				domain,
				subdomain,
			).export();
		} else {
			PostRef.current = new ActivitypubStatusService(
				ActivityPubAdapterService.adaptStatus(
					(data as any).createdNote,
					domain,
				),
				domain,
				subdomain,
			).export();
		}
		setType(BOTTOM_SHEET_ENUM.STATUS_PREVIEW);
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
