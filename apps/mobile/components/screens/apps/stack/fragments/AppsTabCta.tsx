import { memo } from 'react';
import { View, Text } from 'react-native';
import { APP_FONT } from '../../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../../styles/AppFonts';

const AppsTabCta = memo(() => {
	return (
		<View>
			<Text
				style={{
					textAlign: 'center',
					color: APP_FONT.MONTSERRAT_BODY,
					paddingHorizontal: 32,
					fontFamily: APP_FONTS.INTER_700_BOLD,
					marginVertical: 16,
					fontSize: 16,
				}}
			>
				Put the fun back in fediverse{'\n'} with these unique apps.
			</Text>
		</View>
	);
});

export default AppsTabCta;
