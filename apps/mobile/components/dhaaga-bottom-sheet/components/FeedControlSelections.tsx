import { useAppTheme } from '#/states/global/hooks';
import useSetFeedOptions from '#/states/app/useSetFeedOptions';
import ControlSegmentView from '#/components/lib/ControlSegmentView';
import { NativeTextMedium } from '#/ui/NativeText';
import { View } from 'react-native';

type SUPPORTED_FEED_QUERY_CATEGORIES =
	| 'source'
	| 'media_only'
	| 'reply_control'
	| 'repost_control';

type Props = {
	supported: SUPPORTED_FEED_QUERY_CATEGORIES[];
};

/**
 * allows selection and setup of feed options,
 * along various other utilities
 *
 * Usage limitations:
 *
 * - can only be used from a bottom sheet
 * - context.$type !== 'set-feed-options'
 *
 * @constructor
 */
function FeedControlSelections({ supported }: Props) {
	const { theme } = useAppTheme();
	const {
		FeedSource,
		setFeedSource,
		MediaOnlyOptions,
		setMediaOnlyOptions,
		HideReposts,
		setHideReposts,
		HideReplies,
		setHideReplies,
	} = useSetFeedOptions();

	if (supported.length === 0) return <View />;
	return (
		<>
			{supported.includes('source') ? (
				<ControlSegmentView
					label={'Show feed from:'}
					buttons={[
						{
							label: 'All',
							id: 'all',
							onClick: () => {
								setFeedSource('all');
							},
						},

						{
							label: 'Local',
							id: 'local',
							onClick: () => {
								setFeedSource('local');
							},
						},
						{
							label: 'Remote',
							id: 'remote',
							onClick: () => {
								setFeedSource('remote');
							},
						},
					]}
					selection={FeedSource}
				/>
			) : (
				<View />
			)}

			{supported.includes('media_only') ? (
				<ControlSegmentView
					label={'More options:'}
					buttons={[
						{
							label: 'All',
							id: 'all',
							onClick: () => {
								setMediaOnlyOptions('all');
							},
						},
						{
							label: 'Media Only',
							id: 'media-only',
							onClick: () => {
								setMediaOnlyOptions('media-only');
							},
						},
					]}
					selection={MediaOnlyOptions}
				/>
			) : (
				<View />
			)}
			<View style={{ marginBottom: 8 }}>
				<NativeTextMedium style={{ color: theme.complementary }}>
					Close the sheet to apply changes
				</NativeTextMedium>
			</View>
		</>
	);
}

export default FeedControlSelections;
