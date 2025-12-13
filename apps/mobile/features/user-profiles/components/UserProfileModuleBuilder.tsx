import { DefinedUseQueryResult } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { AppDividerSoft } from '#/ui/Divider';
import { TimelineLoadingIndicator } from '#/ui/LoadingIndicator';
import Animated, {
	ScrollHandlerProcessed,
	SharedValue,
} from 'react-native-reanimated';
import { useAppTheme } from '#/states/global/hooks';
import { RefreshControl, StyleProp, ViewStyle } from 'react-native';

type Props<T, U> = {
	queryResult: DefinedUseQueryResult<T, Error>;
	onListEndReached: () => void;
	onDataLoaded: (data: T) => void;
	onModuleReset: () => void;
	onScroll: ScrollHandlerProcessed<Record<string, unknown>>;
	animatedStyle: StyleProp<ViewStyle>;
	headerHeight: SharedValue<number>;
	items: U[];
	renderItem: ({ item }: { item: U }) => any;
	paddingTop: number;
};

/**
 *
 * @param queryResult
 * @param onListEndReached
 * @param onDataLoaded
 * @param onModuleReset
 * @param headerHeight
 * @param items
 * @param renderItem
 * @param onScroll
 * @param paddingTop
 * @constructor
 */
function UserProfileModuleBuilder<T, U>({
	queryResult,
	onListEndReached,
	onDataLoaded,
	onModuleReset,
	headerHeight,
	items,
	renderItem,
	onScroll,
	paddingTop,
}: Props<T, U>) {
	const { theme } = useAppTheme();
	const [IsRefreshing, setIsRefreshing] = useState(false);
	const { fetchStatus, data, status, refetch } = queryResult;
	function onEndReached() {
		if (items.length > 0 && fetchStatus !== 'fetching') {
			onListEndReached();
		}
	}

	useEffect(() => {
		if (fetchStatus === 'fetching' || status !== 'success') return;
		onDataLoaded(data);
	}, [fetchStatus]);

	function onRefresh() {
		setIsRefreshing(true);
		onModuleReset();
		refetch().finally(() => setIsRefreshing(false));
	}

	return (
		<>
			<Animated.FlatList
				data={items}
				onScroll={onScroll}
				renderItem={renderItem}
				refreshControl={
					<RefreshControl refreshing={IsRefreshing} onRefresh={onRefresh} />
				}
				ListHeaderComponent={
					<Animated.View style={{ height: headerHeight.value }} />
				}
				contentContainerStyle={{ paddingTop }}
				style={[{ backgroundColor: theme.background.a0 }]}
				ItemSeparatorComponent={() => (
					<AppDividerSoft style={{ marginVertical: 10 }} />
				)}
				onEndReached={onEndReached}
				/**
				 * Memory tweaks (since Dhaaga is designed
				 * only for a brick phone form factor)
				 */
				initialNumToRender={3}
				maxToRenderPerBatch={6}
				windowSize={7}
			/>
			<TimelineLoadingIndicator
				numItems={items.length}
				networkFetchStatus={fetchStatus}
			/>
		</>
	);
}

export default UserProfileModuleBuilder;
