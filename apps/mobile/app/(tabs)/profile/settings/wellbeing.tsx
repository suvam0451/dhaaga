import { Text, StyleSheet } from 'react-native';
import { useAppTheme } from '#/hooks/utility/global-state-extractors';
import { APP_FONTS } from '#/styles/AppFonts';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import SettingPageBuilder from '#/ui/SettingPageBuilder';

function Page() {
	const { theme } = useAppTheme();
	const { t } = useTranslation([
		LOCALIZATION_NAMESPACE.SETTINGS,
		LOCALIZATION_NAMESPACE.CORE,
	]);

	return (
		<SettingPageBuilder label={t(`wellbeing.navbar_Label`)}>
			<Text style={[styles.text, { color: theme.secondary.a20 }]}>
				{t(`discover.moreSoon.firstHalf`, {
					ns: LOCALIZATION_NAMESPACE.CORE,
				})}{' '}
				<Text style={{ color: theme.complementary.a0 }}>
					{t(`discover.moreSoon.secondHalf`, {
						ns: LOCALIZATION_NAMESPACE.CORE,
					})}
				</Text>
			</Text>
		</SettingPageBuilder>
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
