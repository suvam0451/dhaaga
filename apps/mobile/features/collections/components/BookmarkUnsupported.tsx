import { StyleSheet, View } from 'react-native';
import { appDimensions } from '../../../styles/dimensions';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { AppText } from '../../../components/lib/Text';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';
import { APP_FONTS } from '../../../styles/AppFonts';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../types/app.types';

function BookmarkUnsupported() {
	const { theme } = useAppTheme();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.SHEETS]);

	return (
		<View
			style={[
				styles.root,
				{
					backgroundColor: theme.background.a30,
				},
			]}
		>
			<AppText.Medium
				emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
				style={{ marginBottom: 2, fontFamily: APP_FONTS.INTER_500_MEDIUM }}
			>
				{t(`collections.noBookmarkSupport`)}
			</AppText.Medium>
			<AppText.Medium
				emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
				style={{ fontFamily: APP_FONTS.INTER_500_MEDIUM }}
			>
				{t(`collections.noBookmarkRecommend`)}
			</AppText.Medium>
		</View>
	);
}

export default BookmarkUnsupported;

const styles = StyleSheet.create({
	root: {
		paddingBottom: 16,
		marginBottom: 16,
		paddingTop: appDimensions.bottomSheet.clearanceTop,
		paddingHorizontal: 16,
		borderTopLeftRadius: appDimensions.bottomSheet.borderRadius,
		borderTopRightRadius: appDimensions.bottomSheet.borderRadius,
	},
});
