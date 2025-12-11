import { View } from 'react-native';
import { AppText } from '#/components/lib/Text';
import { useAppTheme } from '#/states/global/hooks';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';

function FeatureNotAvailable() {
	const { theme } = useAppTheme();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);
	return (
		<View style={{ marginHorizontal: 32, marginTop: 64 }}>
			<AppText.Medium
				style={{ textAlign: 'center', fontSize: 28, color: theme.primary }}
			>
				{t(`features.notAvailable.title`)}
			</AppText.Medium>
			<AppText.Normal
				style={{ textAlign: 'center', marginTop: 16 }}
				emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
			>
				{t(`features.notAvailable.desc`)}
			</AppText.Normal>
		</View>
	);
}

export default FeatureNotAvailable;
