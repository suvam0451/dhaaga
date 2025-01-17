import { memo } from 'react';
import { useTimelineController } from '../../../../features/timelines/api/useTimelineController';
import { View, Text } from 'react-native';
import ControlSegment from '../components/ControlSegment';
import useTimelineOptions from '../states/useTimelineOptions';
import { styles } from './_shared';

const HashtagTimelineController = memo(function Foo() {
	const { query } = useTimelineController();
	const {
		FeedOpt,
		MediaOpt,
		onFeedOptSelected,
		onFeedOptAllSelected,
		onMediaOptSelected,
		onMediaOptAllSelected,
		State,
	} = useTimelineOptions();

	return (
		<View>
			<Text style={styles.timelineTypeText}>Hashtag Timeline</Text>
			<Text style={styles.timelineTargetText}>{query?.label}</Text>
			<ControlSegment
				label={'Show feed from:'}
				buttons={[
					{
						label: 'All',
						lookupId: 'all',
						onClick: onFeedOptAllSelected,
					},

					{
						label: 'Local',
						lookupId: 'local',
						onClick: () => {
							onFeedOptSelected(0);
						},
					},
					{
						label: 'Remote',
						lookupId: 'remote',
						onClick: () => {
							onFeedOptSelected(1);
						},
					},
				]}
				selection={FeedOpt}
				hash={State}
			/>

			<ControlSegment
				label={'More options:'}
				buttons={[
					{
						label: 'All',
						lookupId: 'all',
						onClick: onMediaOptAllSelected,
					},
					{
						label: 'Media Only',
						lookupId: 'media-only',
						onClick: () => {
							onMediaOptSelected(0);
						},
					},
				]}
				selection={MediaOpt}
				hash={State}
			/>
		</View>
	);
});

export default HashtagTimelineController;
