import { ScrollView, Text, StyleSheet } from 'react-native';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../../components/shared/topnavbar/AppTopNavbar';
import { useAppTheme } from '../../../../hooks/utility/global-state-extractors';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../../types/app.types';

function Page() {
	const { translateY } = useScrollMoreOnPageEnd();
	const { theme } = useAppTheme();
	const { t } = useTranslation([
		LOCALIZATION_NAMESPACE.SETTINGS,
		LOCALIZATION_NAMESPACE.CORE,
	]);

	return (
		<AppTopNavbar
			type={APP_TOPBAR_TYPE_ENUM.GENERIC}
			title={t(`wellbeing.navbar_Label`)}
			translateY={translateY}
		>
			<ScrollView>
				<Text style={[styles.text, { color: theme.secondary.a20 }]}>
					{t(`discover.moreSoon.fistHalf`, {
						ns: LOCALIZATION_NAMESPACE.CORE,
					})}{' '}
					<Text style={{ color: theme.complementary.a0 }}>
						{t(`discover.moreSoon.secondHalf`, {
							ns: LOCALIZATION_NAMESPACE.CORE,
						})}
					</Text>
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
