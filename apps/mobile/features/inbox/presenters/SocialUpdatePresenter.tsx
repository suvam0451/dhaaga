import { useApiGetSocialUpdates } from '#/hooks/api/useNotifications';
import useNotificationStore from '../interactors/useNotificationStore';
import NotificationItemPresenter from './NotificationItemPresenter';
import SimpleInboxTimeline from '#/components/timelines/SimpleInboxTimeline';
import type { NotificationObjectType } from '@dhaaga/bridge';

function Wrapper({ item }: { item: NotificationObjectType }) {
	return <NotificationItemPresenter item={item} />;
}

function SocialUpdatePresenter() {
	const { maxId } = useNotificationStore();
	const queryResult = useApiGetSocialUpdates(maxId);

	return (
		<SimpleInboxTimeline
			queryResult={queryResult}
			Wrapper={({ item }) => <Wrapper item={item} />}
			type={'social'}
			label={'Social'}
		/>
	);
}

export default SocialUpdatePresenter;
