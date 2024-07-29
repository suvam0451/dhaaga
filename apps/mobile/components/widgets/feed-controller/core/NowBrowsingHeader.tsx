import { View } from 'react-native';
import { Text } from '@rneui/themed';
import { memo, useMemo } from 'react';
import { APP_FONT } from '../../../../styles/AppTheme';
import LocalTimelineController from '../controllers/LocalTimelineController';
import { useTimelineController } from '../../../common/timeline/api/useTimelineController';
import UserTimelineController from '../controllers/UserTimelineController';
import HomeTimelineController from '../controllers/HomeTimelineController';
import HashtagTimelineController from '../controllers/HashtagTimelineController';
import ListTimelineController from '../controllers/ListTimelineController';
import FederatedTimelineController from '../controllers/FederatedTimelineController';
import SocialTimelineController from '../controllers/SocialTimelineController';
import BubbleTimelineController from '../controllers/BubbleTimelineController';
import { TimelineFetchMode } from '../../../common/timeline/utils/timeline.types';

const NowBrowsingHeader = memo(function Foo() {
	const { timelineType } = useTimelineController();

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

	return (
		<View style={{ marginHorizontal: 8, marginBottom: 32 }}>
			<View
				style={{
					marginVertical: 16,
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<View style={{ flex: 1, flexShrink: 1 }}>
					<Text
						style={{
							fontSize: 24,
							fontFamily: 'Inter-Bold',
							color: APP_FONT.MONTSERRAT_BODY,
							textAlign: 'center',
						}}
					>
						Now Browsing
					</Text>
				</View>
			</View>
			{Comp}
		</View>
	);
});

export default NowBrowsingHeader;
