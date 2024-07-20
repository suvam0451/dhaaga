import { memo } from 'react';
import { useTimelineController } from '../../../../states/useTimelineController';
import { View } from 'react-native';
import { Text } from '@rneui/themed';
import { APP_FONT, APP_THEME } from '../../../../styles/AppTheme';

const ListTimelineController = memo(function Foo() {
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
		</View>
	);
});

export default ListTimelineController;
