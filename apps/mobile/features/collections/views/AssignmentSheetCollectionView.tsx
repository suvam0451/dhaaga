import { StyleSheet, Text, View } from 'react-native';
import { APP_FONTS } from '../../../styles/AppFonts';
import { AppText } from '../../../components/lib/Text';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import CollectionItem from '../components/CollectionItem';
import { AccountCollection } from '../../../database/_schema';
import { CollectionHasSavedPost } from '../api/useCollectionsQuery';

type Props = {
	items: CollectionHasSavedPost[];
	toggle: (collection: AccountCollection) => void;
};

function AssignmentSheetCollectionView({ items, toggle }: Props) {
	const { theme } = useAppTheme();
	return (
		<>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					width: '100%',
					marginBottom: 16,
				}}
			>
				<Text style={[styles.sectionLabel, { color: theme.secondary.a0 }]}>
					Collections
				</Text>
				<Text
					style={{
						color: theme.complementary.a0,
						fontFamily: APP_FONTS.INTER_500_MEDIUM,
						fontSize: 16,
					}}
				>
					New collection
				</Text>
			</View>
			{items.map((item, index) => (
				<CollectionItem
					key={index}
					active={item.has}
					activeIconId={'checkmark-circle'}
					inactiveIconId={'add-circle-outline'}
					activeTint={theme.primary.a0}
					inactiveTint={theme.secondary.a30}
					label={item.alias}
					desc={['Local Only', 'Not Synced']}
					onPress={() => {
						toggle(item);
					}}
				/>
			))}
			<AppText.Medium
				style={{
					color: theme.primary.a0,
					marginVertical: 16,
					textAlign: 'center',
					fontFamily: APP_FONTS.INTER_500_MEDIUM,
					marginBottom: 24,
				}}
			>
				ℹ️ Collections can only be viewed from this device!
			</AppText.Medium>
		</>
	);
}

export default AssignmentSheetCollectionView;

const styles = StyleSheet.create({
	root: {
		paddingHorizontal: 16,
		flex: 1,
		marginTop: 12,
	},
	sectionContainer: {
		marginBottom: 16,
	},
	sectionLabel: {
		fontFamily: APP_FONTS.MONTSERRAT_600_SEMIBOLD,
		fontSize: 18,
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
