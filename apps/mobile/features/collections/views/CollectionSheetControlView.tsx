import { appDimensions } from '../../../styles/dimensions';
import { AppText } from '../../../components/lib/Text';
import { Pressable, StyleSheet, View } from 'react-native';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../types/app.types';
import { APP_FONTS } from '../../../styles/AppFonts';

type Props = {
	onPressAddNew: () => void;
};

function CollectionSheetControlView({ onPressAddNew }: Props) {
	const { theme } = useAppTheme();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.SHEETS]);

	return (
		<View
			style={{
				flexDirection: 'row',
				justifyContent: 'space-between',
				width: '100%',
				paddingHorizontal: 16,
				marginBottom: appDimensions.timelines.sectionBottomMargin,
			}}
		>
			<AppText.Medium
				style={[styles.sectionLabel, { color: theme.secondary.a10 }]}
			>
				{t(`collections.collections`)}
			</AppText.Medium>
			<Pressable onPress={onPressAddNew}>
				<AppText.Medium
					style={{
						color: theme.complementary.a0,
						fontSize: 16,
					}}
				>
					{t(`collections.newCollection`)}
				</AppText.Medium>
			</Pressable>
		</View>
	);
}

export default CollectionSheetControlView;

const styles = StyleSheet.create({
	root: {
		paddingHorizontal: 16,
	},
	sectionContainer: {
		marginBottom: 16,
	},
	sectionLabel: {
		fontSize: 20,
		marginBottom: 16,
	},
	tipText: {
		textAlign: 'center',
		marginBottom: 8,
		fontFamily: APP_FONTS.INTER_400_REGULAR,
		maxWidth: 396,
		alignSelf: 'center',
	},
});
