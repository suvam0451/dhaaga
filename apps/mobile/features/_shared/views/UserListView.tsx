import type { UserObjectType } from '@dhaaga/bridge';
import UserListItemDetailedView from '../../timelines/view/UserListItemDetailedView';
import { Animated, RefreshControl, StyleProp, ViewStyle } from 'react-native';

type Props<T> = {
	items: T[];
	onScroll: (...args: any[]) => void;
	refreshing: boolean;
	onRefresh: () => void;
	ListHeaderComponent: any;
	style?: StyleProp<ViewStyle>;
};

export function UserListView({
	items,
	onScroll,
	refreshing,
	onRefresh,
	ListHeaderComponent,
	style,
}: Props<UserObjectType>) {
	return (
		<Animated.FlatList
			data={items}
			renderItem={({ item }) => <UserListItemDetailedView item={item} />}
			onScroll={onScroll}
			ListHeaderComponent={ListHeaderComponent}
			scrollEventThrottle={16}
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
			}
			style={style}
		/>
	);
}
