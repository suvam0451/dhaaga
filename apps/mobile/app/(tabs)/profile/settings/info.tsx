import { memo } from 'react';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../../components/shared/topnavbar/AppTopNavbar';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import { ScrollView, Text } from 'react-native';
import { APP_FONT } from '../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../styles/AppFonts';

const SettingsStackInfo = memo(() => {
	const { translateY } = useScrollMoreOnPageEnd();

	return (
		<AppTopNavbar
			title={'Info'}
			translateY={translateY}
			type={APP_TOPBAR_TYPE_ENUM.GENERIC}
		>
			<ScrollView
				contentContainerStyle={{ paddingTop: 54 + 16, paddingHorizontal: 12 }}
			>
				<Text
					style={{
						color: APP_FONT.MONTSERRAT_BODY,
						fontFamily: APP_FONTS.INTER_500_MEDIUM,
						marginBottom: 16,
					}}
				>
					Will add more stuff here soon.
				</Text>
				<Text
					style={{
						color: APP_FONT.MONTSERRAT_BODY,
						fontFamily: APP_FONTS.INTER_500_MEDIUM,
					}}
				>
					Mostly related to information about what the app does and various
					project links.
				</Text>
			</ScrollView>
		</AppTopNavbar>
	);
});

export default SettingsStackInfo;
