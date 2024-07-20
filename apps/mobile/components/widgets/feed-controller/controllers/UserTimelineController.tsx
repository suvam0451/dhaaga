import { memo } from 'react';
import { Text } from '@rneui/themed';
import { APP_FONT, APP_THEME } from '../../../../styles/AppTheme';
import { View } from 'react-native';
import { useTimelineController } from '../../../../states/useTimelineController';
import ControlSegment from '../components/ControlSegment';

const UserTimelineController = memo(function Foo() {
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
				User Timeline
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
						label: 'Original',
						selected: false,
						onClick: () => {},
					},
					{
						label: 'Replies',
						selected: false,
						onClick: () => {},
					},
					{
						label: 'Reblogs',
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

export default UserTimelineController;
