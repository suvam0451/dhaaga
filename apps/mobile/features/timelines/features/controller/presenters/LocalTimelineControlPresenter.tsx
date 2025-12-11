import ControlSegmentView from '../../../../../components/lib/ControlSegmentView';
import useTimelineControllerInteractor from '../interactors/useTimelineControllerInteractor';
import { View } from 'react-native';

function LocalTimelineControlPresenter() {
	const {
		FeedOpt,
		MediaOpt,
		onFeedOptSelected,
		onFeedOptAllSelected,
		onMediaOptSelected,
		onMediaOptAllSelected,
	} = useTimelineControllerInteractor();
	return (
		<View style={{ paddingHorizontal: 12 }}>
			<ControlSegmentView
				label={'Show posts from:'}
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

			<ControlSegmentView
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
}

export default LocalTimelineControlPresenter;
