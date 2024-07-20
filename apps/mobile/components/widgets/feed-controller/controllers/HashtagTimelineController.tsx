import { memo } from 'react';
import { useTimelineController } from '../../../../states/useTimelineController';
import { Text } from '@rneui/themed';
import { APP_FONT, APP_THEME } from '../../../../styles/AppTheme';
import { View } from 'react-native';
import ControlSegment from '../components/ControlSegment';

const HashtagTimelineController = memo(function Foo() {
	const { query } = useTimelineController();

	return (
		<View>
			<Text
				style={{
					fontFamily: 'Montserrat-Bold',
					color: APP_FONT.MONTSERRAT_BODY,
					fontSize: 16,
				}}
			>
				Hashtag Timeline
			</Text>
			<Text
				style={{
					fontFamily: 'Montserrat-Bold',
					color: APP_THEME.COLOR_SCHEME_D_NORMAL,
					fontSize: 14,
					opacity: 0.75,
				}}
			>
				{query?.label}
			</Text>
			<ControlSegment
				label={'Show feed from:'}
				buttons={[
					{
						label: 'All',
						selected: true,
						onClick: () => {},
					},

					{
						label: 'Local',
						selected: false,
						onClick: () => {},
					},
					{
						label: 'Remote',
						selected: false,
						onClick: () => {},
					},
				]}
			/>

			<ControlSegment
				label={'More options:'}
				buttons={[
					{
						label: 'All',
						selected: true,
						onClick: () => {},
					},
					{
						label: 'Media Only',
						selected: false,
						onClick: () => {},
					},
				]}
			/>
		</View>
	);
});

export default HashtagTimelineController;
