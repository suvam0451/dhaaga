import { AppFlashList } from '../../../components/lib/AppFlashList';
import { AppUserObject } from '../../../types/app-user.types';

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
		<AppFlashList.Users
			data={items}
			onScroll={onScroll}
			refreshing={refreshing}
			onRefresh={onRefresh}
			ListHeaderComponent={ListHeaderComponent}
		/>
	);
}
