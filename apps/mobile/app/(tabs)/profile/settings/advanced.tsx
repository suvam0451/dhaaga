import { StyleSheet } from 'react-native';
import { useAppTheme } from '#/states/global/hooks';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { useTranslation } from 'react-i18next';
import SettingPageBuilder from '#/ui/SettingPageBuilder';
import { NativeTextBold } from '#/ui/NativeText';

function Page() {
	const { theme } = useAppTheme();
	const { t } = useTranslation([
		LOCALIZATION_NAMESPACE.SETTINGS,
		LOCALIZATION_NAMESPACE.CORE,
	]);

	return (
		<SettingPageBuilder label={t(`advanced.navbar_Label`)}>
			<NativeTextBold style={[styles.text, { color: theme.secondary.a20 }]}>
				{t(`discover.moreSoon.firstHalf`, {
					ns: LOCALIZATION_NAMESPACE.CORE,
				})}
				<NativeTextBold style={{ color: theme.complementary }}>
					{t(`discover.moreSoon.secondHalf`, {
						ns: LOCALIZATION_NAMESPACE.CORE,
					})}
				</NativeTextBold>
			</NativeTextBold>
		</SettingPageBuilder>
	);
}

export default Page;

const styles = StyleSheet.create({
	text: {
		marginTop: '50%',
		fontSize: 18,
		textAlign: 'center',
	},
});
