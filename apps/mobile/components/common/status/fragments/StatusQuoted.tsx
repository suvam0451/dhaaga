import { StyleSheet, View } from 'react-native';
import { useAppStatusItem } from '../../../../hooks/ap-proto/useAppStatusItem';
import MediaItem from '../../media/MediaItem';
import PostCreatedBy from './PostCreatedBy';
import { useAppTheme } from '../../../../hooks/utility/global-state-extractors';
import { appDimensions } from '../../../../styles/dimensions';
import { TextContentView } from '../TextContentView';
import { AppText } from '../../../lib/Text';
import { AppIcon } from '../../../lib/Icon';

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
			<AppIcon id={'quote'} size={14} color={theme.complementary.a0} />
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
				styles.root,
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
	root: {
		paddingHorizontal: 10,
		paddingVertical: 4,
		marginTop: 8,
		borderRadius: 6,
		borderStyle: 'dashed',
		borderWidth: 1,
	},
});

export default StatusQuoted;
