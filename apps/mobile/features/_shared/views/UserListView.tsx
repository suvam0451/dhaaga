import type { UserObjectType } from '@dhaaga/bridge';
import UserListItemView from '../../timelines/view/UserListItemView';
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
			renderItem={({ item }) => <UserListItemView item={item} />}
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
