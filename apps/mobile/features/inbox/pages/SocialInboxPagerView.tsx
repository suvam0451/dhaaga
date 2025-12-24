import { useApiGetSocialUpdates } from '#/hooks/api/useNotifications';
import useNotificationStore from '../interactors/useNotificationStore';
import NotificationItemPresenter from '../presenters/NotificationItemPresenter';
import SimpleInboxTimeline from '#/features/timelines/view/SimpleInboxTimeline';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { useTranslation } from 'react-i18next';

function SocialInboxPagerView() {
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);
	const { maxId } = useNotificationStore();
	const queryResult = useApiGetSocialUpdates(maxId);

	return (
		<SimpleInboxTimeline
			queryResult={queryResult}
			Wrapper={({ item }) => <NotificationItemPresenter item={item} />}
			type={'social'}
			label={t(`inbox.nav.social`)}
		/>
	);
}

export default SocialInboxPagerView;
