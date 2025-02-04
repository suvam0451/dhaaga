import { AppUserObject } from '../../../types/app-user.types';
import UserListItemView from '../../timelines/view/UserListItemView';
import { appDimensions } from '../../../styles/dimensions';
import { Animated, RefreshControl } from 'react-native';

type Props<T> = {
	items: T[];
	onScroll: (...args: any[]) => void;
	refreshing: boolean;
	onRefresh: () => void;
	ListHeaderComponent: any;
};

export function UserListView({
	items,
	onScroll,
	refreshing,
	onRefresh,
	ListHeaderComponent,
}: Props<AppUserObject>) {
	return (
		<Animated.FlatList
			data={items}
			renderItem={({ item }) => <UserListItemView item={item} />}
			onScroll={onScroll}
			contentContainerStyle={{
				paddingTop: appDimensions.topNavbar.scrollViewTopPadding,
			}}
			ListHeaderComponent={ListHeaderComponent}
			scrollEventThrottle={16}
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
			}
		/>
	);
}
