import { StyleSheet, Text, View } from 'react-native';
import useMfm from '../../../hooks/useMfm';
import { useAppStatusItem } from '../../../../hooks/ap-proto/useAppStatusItem';
import MediaItem from '../../media/MediaItem';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { FontAwesome } from '@expo/vector-icons';
import PostCreatedBy from './PostCreatedBy';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../../utils/theming.util';
import { useAppTheme } from '../../../../hooks/utility/global-state-extractors';

function StatusQuoted() {
	const { theme } = useAppTheme();
	const { dto } = useAppStatusItem();
	const { content: PostContent } = useMfm({
		content: dto.content.raw,
		emojiMap: dto.calculated.emojis as any,
		emphasis: APP_COLOR_PALETTE_EMPHASIS.A10,
	});

	return (
		<View
			style={[
				styles.rootContainer,
				{
					backgroundColor: theme.palette.bg,
					borderColor: theme.complementaryA.a0,
				},
			]}
		>
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
						color={theme.complementaryB.a0}
						style={{ width: 16 }}
					/>
					<Text
						style={{
							color: theme.complementaryB.a0,
							marginLeft: 4,
							fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
							fontSize: 13,
						}}
					>
						Quoted this Post
					</Text>
				</View>

				<PostCreatedBy />
				{PostContent}
			</View>

			<MediaItem
				attachments={dto.content.media}
				calculatedHeight={dto.calculated.mediaContainerHeight}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	rootContainer: {
		padding: 6,
		paddingTop: 4,
		marginTop: 8,
		borderRadius: 6,
		borderStyle: 'dashed',
		borderWidth: 1,
	},
});

export default StatusQuoted;
