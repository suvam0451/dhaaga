import { View } from 'react-native';
import { useAppTheme } from '#/states/global/hooks';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { appDimensions } from '#/styles/dimensions';
import { NativeTextMedium, NativeTextNormal } from '#/ui/NativeText';

function FeatureNotAvailable() {
	const { theme } = useAppTheme();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);
	return (
		<View
			style={{
				marginHorizontal: 32,
				paddingTop: appDimensions.topNavbar.hubVariantHeight + 8,
				marginVertical: 'auto',
			}}
		>
			<NativeTextMedium
				style={{ textAlign: 'center', fontSize: 28, color: theme.primary }}
			>
				{t(`features.notAvailable.title`)}
			</NativeTextMedium>
			<NativeTextNormal
				style={{ textAlign: 'center', marginTop: 16 }}
				emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
			>
				{t(`features.notAvailable.desc`)}
			</NativeTextNormal>
		</View>
	);
}

export default FeatureNotAvailable;
