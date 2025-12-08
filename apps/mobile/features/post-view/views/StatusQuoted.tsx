import { StyleSheet, View } from 'react-native';
import { withPostItemContext } from '#/components/containers/contexts/WithPostItemContext';
import MediaItem from '#/ui/media/MediaItem';
import PostCreatedBy from '#/components/common/status/fragments/PostCreatedBy';
import { useAppTheme } from '#/hooks/utility/global-state-extractors';
import { appDimensions } from '#/styles/dimensions';
import { TextContentView } from '#/components/common/status/TextContentView';
import { QuoteOrnament } from '#/features/post-view/components/Ornaments';

const SECTION_MARGIN_BOTTOM = appDimensions.timelines.sectionBottomMargin;

function StatusQuoted() {
	const { theme } = useAppTheme();
	const { dto } = withPostItemContext();

	// TODO: media interaction not implemented
	function onPressMediaItem() {}

	if (!dto) {
		console.log('[WARN]: expected post object in quoted status slot', dto);
		return <View />;
	}
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
			<QuoteOrnament />
			<PostCreatedBy style={{ marginBottom: SECTION_MARGIN_BOTTOM }} />
			<MediaItem
				attachments={dto.content.media}
				calculatedHeight={dto.calculated.mediaContainerHeight}
				onPress={onPressMediaItem}
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
