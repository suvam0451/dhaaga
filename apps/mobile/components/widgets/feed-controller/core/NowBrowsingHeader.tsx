import { View, Text } from 'react-native';
import { memo, useMemo } from 'react';
import LocalTimelineController from '../controllers/LocalTimelineController';
import UserTimelineController from '../controllers/UserTimelineController';
import HomeTimelineController from '../controllers/HomeTimelineController';
import HashtagTimelineController from '../controllers/HashtagTimelineController';
import ListTimelineController from '../controllers/ListTimelineController';
import FederatedTimelineController from '../controllers/FederatedTimelineController';
import SocialTimelineController from '../controllers/SocialTimelineController';
import BubbleTimelineController from '../controllers/BubbleTimelineController';
import { TimelineFetchMode } from '../../../../states/reducers/timeline.reducer';
import { useAppBottomSheet_TimelineReference } from '../../../../hooks/utility/global-state-extractors';

const NowBrowsingHeader = memo(function Foo() {
	const { draft } = useAppBottomSheet_TimelineReference();

	const Comp = useMemo(() => {
		switch (draft.feedType) {
			case TimelineFetchMode.LOCAL: {
				return <LocalTimelineController />;
			}
			case TimelineFetchMode.BUBBLE:
				return <BubbleTimelineController />;
			case TimelineFetchMode.HOME:
				return <HomeTimelineController />;
			case TimelineFetchMode.USER: {
				return <UserTimelineController />;
			}
			case TimelineFetchMode.SOCIAL:
				return <SocialTimelineController />;
			case TimelineFetchMode.HASHTAG: {
				return <HashtagTimelineController />;
			}
			case TimelineFetchMode.FEDERATED:
				return <FederatedTimelineController />;
			case TimelineFetchMode.LIST: {
				return <ListTimelineController />;
			}
			default: {
				return (
					<View>
						<Text>Unsupported timeline type</Text>
					</View>
				);
			}
		}
	}, [draft.feedType]);

	return <View style={{ marginHorizontal: 12, marginBottom: 16 }}>{Comp}</View>;
});

export default NowBrowsingHeader;
