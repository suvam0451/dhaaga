import { useApiGetSocialUpdates } from '#/hooks/api/useNotifications';
import useNotificationStore from '../interactors/useNotificationStore';
import NotificationItemPresenter from '../presenters/NotificationItemPresenter';
import SimpleInboxTimeline from '#/features/timelines/view/SimpleInboxTimeline';

function SocialInboxPagerView() {
	const { maxId } = useNotificationStore();
	const queryResult = useApiGetSocialUpdates(maxId);

	return (
		<SimpleInboxTimeline
			queryResult={queryResult}
			Wrapper={({ item }) => <NotificationItemPresenter item={item} />}
			type={'social'}
			label={'Social'}
		/>
	);
}

export default SocialInboxPagerView;
