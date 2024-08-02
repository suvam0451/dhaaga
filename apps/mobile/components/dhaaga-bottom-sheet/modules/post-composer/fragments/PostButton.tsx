import { memo } from 'react';
import { APP_FONT, APP_THEME } from '../../../../../styles/AppTheme';
import { Text, TouchableOpacity } from 'react-native';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import { FontAwesome } from '@expo/vector-icons';
import { useComposerContext } from '../api/useComposerContext';
import { useActivityPubRestClientContext } from '../../../../../states/useActivityPubRestClient';

const PostButton = memo(() => {
	const { rawText, mediaTargets, visibility } = useComposerContext();
	const { client } = useActivityPubRestClientContext();

	async function onClick() {
		console.log('lets see what we have here...');
		console.log(rawText, mediaTargets, visibility);

		const { data, error } = await client.statuses.create({
			status: rawText,
			visibleUserIds: [],
			mastoVisibility: visibility.toLowerCase() as any,
			language: 'en',
			sensitive: false,
			inReplyToId: null,
			mediaIds: mediaTargets.map((o) => o.remoteId.toString()),
			localOnly: false,
		});
		console.log(data, error);
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
