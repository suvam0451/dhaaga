import { memo } from 'react';
import { Text } from '@rneui/themed';
import ControlSegment from '../components/ControlSegment';
import { View } from 'react-native';
import useTimelineOptions from '../states/useTimelineOptions';
import { styles } from './_shared';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

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
	const { acct } = useGlobalState(
		useShallow((o) => ({
			acct: o.acct,
		})),
	);

	return (
		<View>
			<Text style={styles.timelineTypeText}>Local Timeline</Text>
			<Text style={styles.timelineTargetText}>{acct?.server}</Text>
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
