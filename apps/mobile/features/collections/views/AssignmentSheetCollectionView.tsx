import { StyleSheet, View } from 'react-native';
import { APP_FONTS } from '../../../styles/AppFonts';
import { AppText } from '../../../components/lib/Text';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import CollectionItem from '../components/CollectionItem';
import { AccountCollection } from '../../../database/_schema';
import { CollectionHasSavedPost } from '../api/useCollectionsQuery';
import { appDimensions } from '../../../styles/dimensions';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../types/app.types';

type Props = {
	items: CollectionHasSavedPost[];
	toggle: (collection: AccountCollection) => void;
};

function AssignmentSheetCollectionView({ items, toggle }: Props) {
	const { theme } = useAppTheme();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.SHEETS]);

	return (
		<View
			style={{
				paddingHorizontal: 16,
			}}
		>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					width: '100%',
					marginBottom: appDimensions.timelines.sectionBottomMargin,
				}}
			>
				<AppText.Medium
					style={[styles.sectionLabel, { color: theme.secondary.a10 }]}
				>
					{t(`collections.collections`)}
				</AppText.Medium>
				<AppText.Medium
					style={{
						color: theme.complementary.a0,
						fontSize: 16,
					}}
				>
					{t(`collections.newCollection`)}
				</AppText.Medium>
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
					desc={t(`collections.features`, { returnObjects: true }) as string[]}
					onPress={() => {
						toggle(item);
					}}
				/>
			))}
		</View>
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
