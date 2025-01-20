import ControlSegment from '../../../../../components/widgets/feed-controller/components/ControlSegment';
import useTimelineControllerInteractor from '../interactors/useTimelineControllerInteractor';
import { Fragment } from 'react';

function LocalTimelineControlPresenter() {
	const {
		FeedOpt,
		MediaOpt,
		onFeedOptSelected,
		onFeedOptAllSelected,
		onMediaOptSelected,
		onMediaOptAllSelected,
		State,
	} = useTimelineControllerInteractor();
	return (
		<Fragment>
			<ControlSegment
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
		</Fragment>
	);
}

export default LocalTimelineControlPresenter;
