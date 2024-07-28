import { memo } from 'react';
import { Text } from '@rneui/themed';
import ControlSegment from '../components/ControlSegment';
import { View } from 'react-native';
import useTimelineOptions from '../states/useTimelineOptions';
import { styles } from './_shared';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';

const LocalTimelineController = memo(function Foo() {
	const {
		FeedOpt,
		MediaOpt,
		onFeedOptSelected,
		onFeedOptAllSelected,
		onMediaOptSelected,
		onMediaOptAllSelected,
		State,
	} = useTimelineOptions();
	const { subdomain } = useActivityPubRestClientContext();

	return (
		<View>
			<Text style={styles.timelineTypeText}>Local Timeline</Text>
			<Text style={styles.timelineTargetText}>{subdomain}</Text>
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
			<Text style={styles.timelineDescription}>
				This timeline displays posts from you and other users in your instance
			</Text>
		</View>
	);
});

export default LocalTimelineController;
