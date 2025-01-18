import { StyleSheet, View } from 'react-native';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
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
		<View
			style={[
				styles.sectionContainer,
				{
					paddingTop: 36,
					paddingHorizontal: 16,
					backgroundColor: theme.background.a30,
					borderTopLeftRadius: 32,
					borderTopRightRadius: 32,
				},
			]}
		>
			<CollectionItem
				label={'Bookmark'}
				desc={['Synced With Your Server']}
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
		fontSize: 20,
		marginBottom: 16,
	},
});
