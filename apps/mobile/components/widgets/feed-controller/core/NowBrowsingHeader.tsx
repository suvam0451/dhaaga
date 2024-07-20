import { View } from 'react-native';
import { Text } from '@rneui/themed';
import { memo, useMemo } from 'react';
import { TimelineType } from '../../../../types/timeline.types';
import { APP_FONT } from '../../../../styles/AppTheme';
import PublicTimelineController from '../controllers/PublicTimelineController';
import {
	TimelineFetchMode,
	useTimelineController,
} from '../../../../states/useTimelineController';
import UserTimelineController from '../controllers/UserTimelineController';
import HomeTimelineController from '../controllers/HomeTimelineController';
import HashtagTimelineController from '../controllers/HashtagTimelineController';

type Props = {
	feedType: TimelineType;
};

const NowBrowsingHeader = memo(function Foo({ feedType }: Props) {
	const { timelineType } = useTimelineController();

	const Comp = useMemo(() => {
		switch (timelineType) {
			case TimelineFetchMode.LOCAL: {
				return <PublicTimelineController />;
			}
			case TimelineFetchMode.HOME:
				return <HomeTimelineController />;
			case TimelineFetchMode.USER: {
				return <UserTimelineController />;
			}
			case TimelineFetchMode.HASHTAG: {
				return <HashtagTimelineController />;
			}
			default: {
				return (
					<View>
						<Text>Unsupported timeline type</Text>
					</View>
				);
			}
		}
	}, [feedType]);

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
