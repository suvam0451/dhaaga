import { memo, useState } from 'react';
import AppNotificationViewContainer from './_container';
import { APP_LANDING_PAGE_TYPE } from '../../../../shared/topnavbar/AppTabLandingNavbar';
import { useApiGetSocialUpdates } from '../../../../../hooks/api/useNotifications';

const SocialView = memo(() => {
	const [IsRefreshing, setIsRefreshing] = useState(false);
	const { data, refetch } = useApiGetSocialUpdates();

	function refresh() {
		setIsRefreshing(true);
		refetch().finally(() => {
			setIsRefreshing(false);
		});
	}

	return (
		<AppNotificationViewContainer
			data={data.items}
			tabType={APP_LANDING_PAGE_TYPE.SOCIAL}
			menuItems={[
				{
					iconId: 'cog',
				},
				{
					iconId: 'user-guide',
				},
			]}
			tip={'These people have liked, shared and reacted to your posts.'}
			refreshing={IsRefreshing}
			onRefresh={refresh}
		/>
	);
});

export default SocialView;
