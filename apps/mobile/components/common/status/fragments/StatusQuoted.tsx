import { memo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import StatusPostedBy from './StatusPostedBy';
import useMfm from '../../../hooks/useMfm';
import { useAppStatusItem } from '../../../../hooks/ap-proto/useAppStatusItem';
import { APP_FONT } from '../../../../styles/AppTheme';
import MediaItem from '../../media/MediaItem';

const StatusQuoted = memo(() => {
	const { dto } = useAppStatusItem();
	const {
		content: PostContent,
		aiContext,
		isLoaded,
	} = useMfm({
		content: dto.content.raw,
		remoteSubdomain: dto.postedBy.instance,
		emojiMap: dto.calculated.emojis as any,
		deps: [dto],
	});

	return (
		<View style={styles.rootContainer}>
			<StatusPostedBy />
			{PostContent}
			<MediaItem
				attachments={dto.content.media}
				calculatedHeight={dto.calculated.mediaContainerHeight}
			/>
		</View>
	);
});

const styles = StyleSheet.create({
	rootContainer: {
		padding: 10,
		marginTop: 8,
		// marginLeft: 8,
		backgroundColor: '#040404',
		borderRadius: 6,
		borderStyle: 'dashed',
		borderWidth: 1,
		borderColor: 'orange',
	},
});
export default StatusQuoted;
