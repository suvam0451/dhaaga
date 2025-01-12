import { StyleSheet, Text, View } from 'react-native';
import useMfm from '../../../hooks/useMfm';
import { useAppStatusItem } from '../../../../hooks/ap-proto/useAppStatusItem';
import MediaItem from '../../media/MediaItem';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { FontAwesome } from '@expo/vector-icons';
import PostCreatedBy from './PostCreatedBy';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../../utils/theming.util';
import { useAppTheme } from '../../../../hooks/utility/global-state-extractors';
import { appDimensions } from '../../../../styles/dimensions';

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
			<Text
				style={{
					color: theme.complementary.a0,
					marginLeft: 4,
					fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
					fontSize: 13,
				}}
			>
				Quoted this Post
			</Text>
		</View>
	);
}

function StatusQuoted() {
	const { theme } = useAppTheme();
	const { dto } = useAppStatusItem();
	const { content: PostContent } = useMfm({
		content: dto?.content?.raw,
		emojiMap: (dto?.calculated?.emojis as any) || new Map(),
		emphasis: APP_COLOR_PALETTE_EMPHASIS.A10,
		fontFamily: APP_FONTS.ROBOTO_400,
	});

	return (
		<View
			style={[
				styles.rootContainer,
				{
					borderColor: theme.complementaryA.a0,
					marginBottom: SECTION_MARGIN_BOTTOM * 2,
				},
			]}
		>
			<QuoteIndicator />
			<PostCreatedBy style={{ marginBottom: SECTION_MARGIN_BOTTOM }} />
			<View style={{ marginBottom: SECTION_MARGIN_BOTTOM }}>{PostContent}</View>
			<MediaItem
				attachments={dto.content.media}
				calculatedHeight={dto.calculated.mediaContainerHeight}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	rootContainer: {
		padding: 10,
		paddingTop: 4,
		marginTop: 8,
		borderRadius: 6,
		borderStyle: 'dashed',
		borderWidth: 1,
	},
});

export default StatusQuoted;
