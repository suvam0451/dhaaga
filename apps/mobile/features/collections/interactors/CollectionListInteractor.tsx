import { AccountCollection } from '../../../database/_schema';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../components/shared/topnavbar/AppTopNavbar';
import { FlatList, RefreshControl } from 'react-native';
import { appDimensions } from '../../../styles/dimensions';
import { AppText } from '../../../components/lib/Text';
import ReadOnlyView from '../views/ReadOnlyView';
import { AppCtaButton } from '../../../components/lib/Buttons';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { RefetchOptions } from '@tanstack/react-query';
import { useState } from 'react';
import { router } from 'expo-router';
import { APP_ROUTING_ENUM } from '../../../utils/route-list';

type CollectionListInteractorProps = {
	items: AccountCollection[];
	refetch: (options?: RefetchOptions) => Promise<any>;
};

function CollectionListInteractor({
	items,
	refetch,
}: CollectionListInteractorProps) {
	const [IsRefreshing, setIsRefreshing] = useState(false);
	const { translateY } = useScrollMoreOnPageEnd();
	const { theme } = useAppTheme();

	function onRefresh() {
		setIsRefreshing(true);
		refetch().finally(() => {
			setIsRefreshing(false);
		});
	}

	function onAdd() {}

	function onItemPress(id: number) {
		router.navigate({
			pathname: APP_ROUTING_ENUM.APP_FEATURE_COLLECTION,
			params: {
				id,
			},
		});
	}

	return (
		<AppTopNavbar
			type={APP_TOPBAR_TYPE_ENUM.GENERIC}
			title={'Collections'}
			translateY={translateY}
		>
			<FlatList
				data={items}
				renderItem={({ item }) => (
					<ReadOnlyView item={item} onPress={onItemPress} />
				)}
				contentContainerStyle={{
					paddingTop: appDimensions.topNavbar.scrollViewTopPadding,
					paddingHorizontal: 10,
				}}
				ListHeaderComponent={
					<AppText.Special
						style={{ marginVertical: 24, color: theme.primary.a0 }}
					>
						Collections
					</AppText.Special>
				}
				ListFooterComponent={<AppCtaButton onPress={onAdd} />}
				refreshControl={
					<RefreshControl refreshing={IsRefreshing} onRefresh={onRefresh} />
				}
			/>
		</AppTopNavbar>
	);
}

export default CollectionListInteractor;
