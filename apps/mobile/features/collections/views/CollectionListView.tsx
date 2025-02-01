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
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../types/app.types';

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
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	return (
		<AppTopNavbar
			type={APP_TOPBAR_TYPE_ENUM.GENERIC}
			title={t(`collections.name`)}
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
						{t(`collections.name`)}
					</AppText.Special>
				}
				ListFooterComponent={
					<AppCtaButton label={t(`collections.addButton`)} onPress={onAdd} />
				}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={refresh} />
				}
			/>
		</AppTopNavbar>
	);
}

export default CollectionListView;
