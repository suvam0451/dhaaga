import { memo } from 'react';
import { View } from 'react-native';
import { Text } from '@rneui/themed';
import { APP_FONT, APP_THEME } from '../../../../styles/AppTheme';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';

const HomeTimelineController = memo(function Foo() {
	const { subdomain } = useActivityPubRestClientContext();
	return (
		<View>
			<Text
				style={{
					fontFamily: 'Montserrat-Bold',
					color: APP_FONT.MONTSERRAT_BODY,
					fontSize: 16,
				}}
			>
				Your Home Timeline
			</Text>
			<Text
				style={{
					fontFamily: 'Montserrat-Bold',
					color: APP_THEME.COLOR_SCHEME_D_NORMAL,
					fontSize: 14,
					opacity: 0.75,
				}}
			>
				{subdomain}
			</Text>
		</View>
	);
});

export default HomeTimelineController;
