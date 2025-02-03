import useAppPaginator from '../../../hooks/app/useAppPaginator';
import { AppResultPageType } from '../../../types/app.types';
import { AppNotificationObject } from '../../../types/app-notification.types';

function useNotificationStore() {
	const { lastId, loadNext } = useAppPaginator();

	function appendNotifications(data: AppResultPageType<AppNotificationObject>) {
		lastId.current = data.maxId;
	}

	return {
		append: appendNotifications,
		loadNext,
	};
}

export default useNotificationStore;
