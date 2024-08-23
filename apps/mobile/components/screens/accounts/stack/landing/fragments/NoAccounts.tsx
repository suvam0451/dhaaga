import { View } from 'react-native';
import { Text } from '@rneui/themed';
import { APP_FONTS } from '../../../../../../styles/AppFonts';
import { APP_FONT } from '../../../../../../styles/AppTheme';
import { memo } from 'react';

const NoAccountsToShow = memo(({ service }: { service: string }) => {
	return (
		<View
			style={{
				borderWidth: 1,
				borderColor: '#888',
				padding: 8,
				borderRadius: 8,
				marginHorizontal: 8,
			}}
		>
			<Text
				style={{
					textAlign: 'center',
					fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
					color: APP_FONT.MONTSERRAT_BODY,
				}}
			>
				You have not added any {service} compatible account
			</Text>
		</View>
	);
});

export default NoAccountsToShow;
