import { AccountCollection } from '../../../database/_schema';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../components/shared/topnavbar/AppTopNavbar';
import { FlatList, RefreshControl } from 'react-native';
import { appDimensions } from '../../../styles/dimensions';
import { AppText } from '../../../components/lib/Text';
import CollectionListItemView from './CollectionListItemView';
import { AppCtaButton } from '../../../components/lib/Buttons';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';

type CollectionListInteractorProps = {
	items: AccountCollection[];
	onAdd: () => void;
	onPress: (id: number) => void;
	onLongPress: (id: number) => void;
	refresh: () => void;
	refreshing: boolean;
};

function CollectionListView({
	items,
	onAdd,
	onPress,
	onLongPress,
	refresh,
	refreshing,
}: CollectionListInteractorProps) {
	const { translateY } = useScrollMoreOnPageEnd();
	const { theme } = useAppTheme();

	return (
		<AppTopNavbar
			type={APP_TOPBAR_TYPE_ENUM.GENERIC}
			title={'Collections'}
			translateY={translateY}
		>
			<FlatList
				data={items}
				renderItem={({ item }) => (
					<CollectionListItemView
						item={item}
						onPress={() => {
							onPress(item.id);
						}}
						onLongPress={() => {
							onLongPress(item.id);
						}}
					/>
				)}
				contentContainerStyle={{
					paddingTop: appDimensions.topNavbar.scrollViewTopPadding + 4,
					paddingHorizontal: 10,
				}}
				ListHeaderComponent={
					<AppText.Special
						style={{
							marginVertical: 24,
							fontSize: 32,
							color: theme.primary.a0,
						}}
					>
						Collections
					</AppText.Special>
				}
				ListFooterComponent={
					<AppCtaButton label={'Add Collection'} onPress={onAdd} />
				}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={refresh} />
				}
			/>
		</AppTopNavbar>
	);
}

export default CollectionListView;
