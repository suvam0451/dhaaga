import { Fragment, useState } from 'react';
import { APP_LANDING_PAGE_TYPE } from '#/components/shared/topnavbar/AppTabLandingNavbar';
import { useApiGetChatUpdates } from '#/hooks/api/useNotifications';
import { RefreshControl } from 'react-native';
import { AppFlashList } from '#/components/lib/AppFlashList';
import { useAppApiClient } from '#/states/global/hooks';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import Header from '../components/Header';
import FeatureNotAvailable from '../components/FeatureNotAvailable';

function ChatroomPresenter() {
	const [IsRefreshing, setIsRefreshing] = useState(false);
	const { driver } = useAppApiClient();
	const { refetch, data } = useApiGetChatUpdates();

	function refresh() {
		setIsRefreshing(true);
		refetch().finally(() => {
			setIsRefreshing(false);
		});
	}

	if (driver !== KNOWN_SOFTWARE.BLUESKY) {
		return (
			<Fragment>
				<Header type={APP_LANDING_PAGE_TYPE.CHAT} />
				<FeatureNotAvailable />
			</Fragment>
		);
	}

	return (
		<AppFlashList.Chatrooms
			data={data}
			ListHeaderComponent={<Header type={APP_LANDING_PAGE_TYPE.CHAT} />}
			refreshControl={
				<RefreshControl refreshing={IsRefreshing} onRefresh={refresh} />
			}
		/>
	);
}

export default ChatroomPresenter;
