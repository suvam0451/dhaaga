import { View } from 'react-native';
import { AppText } from '#/components/lib/Text';
import { useAppTheme } from '#/states/global/hooks';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';

function CollectionEmpty() {
	const { theme } = useAppTheme();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	return (
		<View style={{ marginTop: 54 + 48, alignItems: 'center' }}>
			<AppText.SemiBold
				style={{
					fontSize: 24,
					marginBottom: 12,
					color: theme.primary,
				}}
			>
				{t(`collections.emptyTitle`)}
			</AppText.SemiBold>
			<AppText.Medium emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}>
				{t(`collections.emptyDesc`)}
			</AppText.Medium>
		</View>
	);
}

export default CollectionEmpty;
