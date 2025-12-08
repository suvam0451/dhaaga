import { useApiGetSubscriptionUpdates } from '#/hooks/api/useNotifications';
import useNotificationStore from '../interactors/useNotificationStore';
import NotificationItemPresenter from './NotificationItemPresenter';
import SimpleInboxTimeline from '#/components/timelines/SimpleInboxTimeline';
import type { NotificationObjectType } from '@dhaaga/bridge/typings';

function Wrapper({ item }: { item: NotificationObjectType }) {
	return <NotificationItemPresenter item={item} />;
}

function UpdatesPresenter() {
	const { maxId } = useNotificationStore();
	const queryResult = useApiGetSubscriptionUpdates(maxId);

	return (
		<SimpleInboxTimeline
			queryResult={queryResult}
			Wrapper={({ item }) => <Wrapper item={item} />}
		/>
	);
}

export default UpdatesPresenter;
