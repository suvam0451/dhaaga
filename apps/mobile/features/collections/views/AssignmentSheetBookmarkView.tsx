import { StyleSheet, View } from 'react-native';
import { useAppTheme } from '#/states/global/hooks';
import CollectionItem from '../components/CollectionItem';
import { appDimensions } from '#/styles/dimensions';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';

type AssignmentSheetBookmarkViewProps = {
	bookmarked: boolean;
	toggleBookmark: (loader?: (flag: boolean) => void) => void;
};

function AssignmentSheetBookmarkView({
	bookmarked,
	toggleBookmark,
}: AssignmentSheetBookmarkViewProps) {
	const { theme } = useAppTheme();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.SHEETS]);

	const TIP_TEXT_COLOR = theme.secondary.a40;

	return (
		<View
			style={[
				styles.root,
				{
					backgroundColor: theme.background.a30,
				},
			]}
		>
			<CollectionItem
				label={t(`collections.bookmark`)}
				desc={t(`collections.bookmarkDesc`)}
				activeIconId={'bookmark'}
				inactiveIconId={'bookmark-outline'}
				active={bookmarked}
				activeTint={theme.primary}
				inactiveTint={TIP_TEXT_COLOR}
				onPress={() => {
					toggleBookmark();
				}}
			/>
		</View>
	);
}

export default AssignmentSheetBookmarkView;

const styles = StyleSheet.create({
	root: {
		marginBottom: 16,
		paddingTop: appDimensions.bottomSheet.clearanceTop + 8,
		paddingHorizontal: 16,
		borderTopLeftRadius: appDimensions.bottomSheet.borderRadius,
		borderTopRightRadius: appDimensions.bottomSheet.borderRadius,
	},
	sectionLabel: {
		fontSize: 20,
		marginBottom: 16,
	},
});
