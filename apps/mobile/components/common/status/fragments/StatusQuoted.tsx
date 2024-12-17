import { memo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import useMfm from '../../../hooks/useMfm';
import { useAppStatusItem } from '../../../../hooks/ap-proto/useAppStatusItem';
import MediaItem from '../../media/MediaItem';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { FontAwesome } from '@expo/vector-icons';
import PostCreatedBy from './PostCreatedBy';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

const StatusQuoted = memo(() => {
	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);
	const { dto } = useAppStatusItem();
	const { content: PostContent } = useMfm({
		content: dto.content.raw,
		remoteSubdomain: dto.postedBy.instance,
		emojiMap: dto.calculated.emojis as any,
		deps: [dto],
		emphasis: 'high',
	});

	return (
		<View style={[styles.rootContainer, { backgroundColor: theme.palette.bg }]}>
			<View>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						marginBottom: 4,
						minWidth: '100%',
					}}
				>
					<FontAwesome
						name="quote-left"
						size={14}
						color={theme.textColor.medium}
						style={{ width: 16 }}
					/>
					<Text
						style={{
							color: theme.textColor.medium,
							marginLeft: 4,
							fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
							fontSize: 13,
						}}
					>
						Referenced this Post
					</Text>
				</View>

				<PostCreatedBy dto={dto} />
				{PostContent}
			</View>

			<MediaItem
				attachments={dto.content.media}
				calculatedHeight={dto.calculated.mediaContainerHeight}
			/>
		</View>
	);
});

const styles = StyleSheet.create({
	rootContainer: {
		padding: 6,
		paddingTop: 4,
		marginTop: 8,
		borderRadius: 6,
		borderStyle: 'dashed',
		borderWidth: 1,
		borderColor: 'orange',
	},
});
export default StatusQuoted;
