import { memo } from 'react';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../../components/shared/topnavbar/AppTopNavbar';
import { ScrollView, Text, View } from 'react-native';
import { APP_FONT } from '../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../styles/AppFonts';
import Coffee from '../../../../components/static/sponsorship/Coffee';

const SettingsStackSupport = memo(() => {
	const { translateY } = useScrollMoreOnPageEnd();

	return (
		<AppTopNavbar
			title={'Support Me'}
			translateY={translateY}
			type={APP_TOPBAR_TYPE_ENUM.GENERIC}
		>
			<ScrollView
				contentContainerStyle={{ paddingTop: 54 + 16, paddingHorizontal: 16 }}
			>
				<Text
					style={{
						color: APP_FONT.MONTSERRAT_BODY,
						fontFamily: APP_FONTS.INTER_500_MEDIUM,
						textAlign: 'center',
						marginBottom: 32,
					}}
				>
					If you think{' '}
					<Text
						style={{
							fontFamily: APP_FONTS.INTER_500_MEDIUM,
							color: APP_FONT.MONTSERRAT_HEADER,
						}}
					>
						#DhaagaApp
					</Text>{' '}
					is pretty cool, Tell your friends about it!
				</Text>

				<View style={{ marginBottom: 16 }}>
					<Text
						style={{
							fontFamily: APP_FONTS.INTER_500_MEDIUM,
							color: APP_FONT.MONTSERRAT_BODY,
							textAlign: 'center',
						}}
					>
						If you really love the app, you can send me a tip!
					</Text>
				</View>
				<Coffee />

				<View style={{ marginBottom: 16 }}>
					<Text
						style={{
							fontFamily: APP_FONTS.INTER_500_MEDIUM,
							color: APP_FONT.MONTSERRAT_BODY,
							textAlign: 'center',
							fontSize: 13,
							marginTop: 32,
						}}
					>
						(More ways to support my Indie journey long-term are available from
						the project's website and GitHub.)
					</Text>
				</View>
			</ScrollView>
		</AppTopNavbar>
	);
});

export default SettingsStackSupport;
