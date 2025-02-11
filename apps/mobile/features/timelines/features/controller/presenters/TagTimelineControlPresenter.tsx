import { View } from 'react-native';
import ControlSegmentView from '../../../../../components/lib/ControlSegmentView';

type Props = {
	MediaOpt: Set<string>;
	onMediaOptSelected: (index: number) => void;
	onMediaOptAllSelected: () => void;
	hash: string;
	FeedOpt: Set<string>;
	onFeedOptSelected: (index: number) => void;
	onFeedOptAllSelected: () => void;
};

function TagTimelineControlPresenter({
	FeedOpt,
	MediaOpt,
	onFeedOptSelected,
	onFeedOptAllSelected,
	onMediaOptSelected,
	onMediaOptAllSelected,
	hash,
}: Props) {
	return (
		<View>
			<ControlSegmentView
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
				hash={hash}
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
				hash={hash}
			/>
		</View>
	);
}

export default TagTimelineControlPresenter;
