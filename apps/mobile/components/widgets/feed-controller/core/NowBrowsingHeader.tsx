import { View } from 'react-native';
import { Text } from '@rneui/themed';
import { memo, useMemo } from 'react';
import LocalTimelineController from '../controllers/LocalTimelineController';
import UserTimelineController from '../controllers/UserTimelineController';
import HomeTimelineController from '../controllers/HomeTimelineController';
import HashtagTimelineController from '../controllers/HashtagTimelineController';
import ListTimelineController from '../controllers/ListTimelineController';
import FederatedTimelineController from '../controllers/FederatedTimelineController';
import SocialTimelineController from '../controllers/SocialTimelineController';
import BubbleTimelineController from '../controllers/BubbleTimelineController';
import { TimelineFetchMode } from '../../../common/timeline/utils/timeline.types';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

const NowBrowsingHeader = memo(function Foo() {
	const { timelineType } = useGlobalState(
		useShallow((o) => ({
			timelineType: o.homepageType,
		})),
	);

	const Comp = useMemo(() => {
		switch (timelineType) {
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
	}, [timelineType]);

	return <View style={{ marginHorizontal: 12, marginBottom: 32 }}>{Comp}</View>;
});

export default NowBrowsingHeader;
