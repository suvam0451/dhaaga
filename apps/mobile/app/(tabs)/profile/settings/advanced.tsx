import { ScrollView, Text, StyleSheet } from 'react-native';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../../components/shared/topnavbar/AppTopNavbar';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { useAppTheme } from '../../../../hooks/utility/global-state-extractors';

function Page() {
	const { translateY } = useScrollMoreOnPageEnd();
	const { theme } = useAppTheme();

	return (
		<AppTopNavbar
			type={APP_TOPBAR_TYPE_ENUM.GENERIC}
			title={'Advanced Settings'}
			translateY={translateY}
		>
			<ScrollView>
				<Text style={[styles.text, { color: theme.secondary.a20 }]}>
					More settings coming{' '}
					<Text style={{ color: theme.complementary.a0 }}>soon™</Text>
				</Text>
			</ScrollView>
		</AppTopNavbar>
	);
}

export default Page;

const styles = StyleSheet.create({
	text: {
		fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
		marginTop: '50%',
		fontSize: 18,
		textAlign: 'center',
	},
});
