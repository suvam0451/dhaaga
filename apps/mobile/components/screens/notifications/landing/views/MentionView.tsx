import { memo } from 'react';
import { APP_LANDING_PAGE_TYPE } from '../../../../shared/topnavbar/AppTabLandingNavbar';
import AppNotificationViewContainer from './_container';
import { useApiGetMentionUpdates } from '../../../../../hooks/api/useNotifications';

const MentionView = memo(() => {
	const { data } = useApiGetMentionUpdates();
	return (
		<AppNotificationViewContainer
			menuItems={[
				{
					iconId: 'user-guide',
				},
			]}
			tabType={APP_LANDING_PAGE_TYPE.MENTIONS}
			tip={'These users have mentioned or replied to you.'}
			data={data.data}
		/>
	);
});

export default MentionView;
