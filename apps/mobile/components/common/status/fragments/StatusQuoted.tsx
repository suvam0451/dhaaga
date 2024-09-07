import { memo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import StatusPostedBy from './StatusPostedBy';
import useMfm from '../../../hooks/useMfm';
import { useAppStatusItem } from '../../../../hooks/ap-proto/useAppStatusItem';
import MediaItem from '../../media/MediaItem';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { FontAwesome } from '@expo/vector-icons';

const StatusQuoted = memo(() => {
	const { dto } = useAppStatusItem();
	const { content: PostContent } = useMfm({
		content: dto.content.raw,
		remoteSubdomain: dto.postedBy.instance,
		emojiMap: dto.calculated.emojis as any,
		deps: [dto],
	});

	return (
		<View style={styles.rootContainer}>
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
						color="#888"
						style={{ width: 16 }}
					/>
					<Text
						style={{
							color: 'rgba(136,136,136,0.87)',
							marginLeft: 4,
							fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
							fontSize: 13,
						}}
					>
						Referenced this Post
					</Text>
				</View>

				<StatusPostedBy dto={dto} />
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
		backgroundColor: '#040404',
		borderRadius: 6,
		borderStyle: 'dashed',
		borderWidth: 1,
		borderColor: 'orange',
	},
});
export default StatusQuoted;
