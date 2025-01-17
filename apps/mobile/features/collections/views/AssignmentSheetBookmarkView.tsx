import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { APP_FONTS } from '../../../styles/AppFonts';
import CollectionItem from '../components/CollectionItem';

type AssignmentSheetBookmarkViewProps = {
	bookmarked: boolean;
	toggleBookmark: (loader?: (flag: boolean) => void) => void;
};

function AssignmentSheetBookmarkView({
	bookmarked,
	toggleBookmark,
}: AssignmentSheetBookmarkViewProps) {
	const { theme } = useAppTheme();

	const TIP_TEXT_COLOR = theme.secondary.a40;

	return (
		<View style={styles.sectionContainer}>
			<Text style={[styles.sectionLabel, { color: theme.secondary.a10 }]}>
				Bookmark
			</Text>
			<CollectionItem
				label={'Bookmark'}
				desc={['Server Feature', 'Synced']}
				activeIconId={'bookmark'}
				inactiveIconId={'bookmark-outline'}
				active={bookmarked}
				activeTint={theme.primary.a0}
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
	sectionContainer: {
		marginBottom: 16,
	},
	sectionLabel: {
		fontFamily: APP_FONTS.MONTSERRAT_600_SEMIBOLD,
		fontSize: 18,
		marginBottom: 16,
	},
});
