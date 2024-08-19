import { memo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ActivityPubStatusAppDtoType } from '../../../../services/ap-proto/activitypub-status-dto.service';
import { APP_FONT, APP_THEME } from '../../../../styles/AppTheme';
import StatusPostedBy from './StatusPostedBy';
import useMfm from '../../../hooks/useMfm';
import MediaItem from '../../media/MediaItem';
import PostStats from '../PostStats';
import useAppNavigator from '../../../../states/useAppNavigator';
import WithAppStatusItemContext from '../../../../hooks/ap-proto/useAppStatusItem';
import StatusQuoted from './StatusQuoted';

type StatusReplyToProps = {
	dto: ActivityPubStatusAppDtoType;
};

const StatusReplyTo = memo(({ dto }: StatusReplyToProps) => {
	const { toPost } = useAppNavigator();
	const { content } = useMfm({
		content: dto.content.raw,
		remoteSubdomain: dto.postedBy.instance,
		emojiMap: dto.calculated.emojis as any,
		deps: [dto],
	});

	const IS_QUOTE_BOOST = dto.meta.isBoost && dto.content.raw;

	return (
		<View style={styles.rootContainer}>
			<StatusPostedBy dto={dto} />
			<View style={{ marginLeft: 48, position: 'relative' }}>
				<TouchableOpacity
					delayPressIn={100}
					onPress={() => {
						toPost(dto.id);
					}}
				>
					{content}
				</TouchableOpacity>
				<MediaItem
					attachments={dto.content.media}
					calculatedHeight={dto.calculated.mediaContainerHeight}
				/>
				{IS_QUOTE_BOOST && (
					<WithAppStatusItemContext dto={dto.boostedFrom}>
						<StatusQuoted />
					</WithAppStatusItemContext>
				)}

				<PostStats dto={dto} />
				<View
					style={{
						position: 'absolute',
						minHeight: '100%',
						left: -24,
						marginBottom: -32,
						overflow: 'visible',
						marginTop: -8,
					}}
				>
					<View
						style={{
							height: '100%',
							width: 1.5,
							backgroundColor: APP_FONT.DISABLED,
						}}
					></View>
				</View>
			</View>
		</View>
	);
});

const styles = StyleSheet.create({
	rootContainer: {
		backgroundColor: APP_THEME.DARK_THEME_STATUS_BG,
		padding: 10,
		position: 'relative',
	},
});

export default StatusReplyTo;
