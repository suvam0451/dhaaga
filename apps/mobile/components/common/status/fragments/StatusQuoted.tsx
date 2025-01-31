import { StyleSheet, Text, View } from 'react-native';
import { useAppStatusItem } from '../../../../hooks/ap-proto/useAppStatusItem';
import MediaItem from '../../media/MediaItem';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { FontAwesome } from '@expo/vector-icons';
import PostCreatedBy from './PostCreatedBy';
import { useAppTheme } from '../../../../hooks/utility/global-state-extractors';
import { appDimensions } from '../../../../styles/dimensions';
import { TextContentView } from '../TextContentView';
import { AppText } from '../../../lib/Text';

const SECTION_MARGIN_BOTTOM = appDimensions.timelines.sectionBottomMargin;

function QuoteIndicator() {
	const { theme } = useAppTheme();

	return (
		<View
			style={{
				flexDirection: 'row',
				alignItems: 'center',
				marginBottom: SECTION_MARGIN_BOTTOM,
			}}
		>
			<FontAwesome
				name="quote-left"
				size={14}
				color={theme.complementary.a0}
				style={{ width: 16 }}
			/>
			<AppText.SemiBold
				style={{
					color: theme.complementary.a0,
					marginLeft: 4,
				}}
			>
				Quoted this Post
			</AppText.SemiBold>
		</View>
	);
}

function StatusQuoted() {
	const { theme } = useAppTheme();
	const { dto } = useAppStatusItem();

	return (
		<View
			style={[
				styles.rootContainer,
				{
					borderColor: theme.complementaryA.a0,
					marginBottom: SECTION_MARGIN_BOTTOM * 1.5,
				},
			]}
		>
			<QuoteIndicator />
			<PostCreatedBy style={{ marginBottom: SECTION_MARGIN_BOTTOM }} />
			<MediaItem
				attachments={dto.content.media}
				calculatedHeight={dto.calculated.mediaContainerHeight}
			/>
			<TextContentView
				tree={dto.content.parsed}
				variant={'bodyContent'}
				mentions={[]}
				emojiMap={dto.calculated.emojis}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	rootContainer: {
		paddingHorizontal: 10,
		paddingVertical: 4,
		marginTop: 8,
		borderRadius: 6,
		borderStyle: 'dashed',
		borderWidth: 1,
	},
});

export default StatusQuoted;
