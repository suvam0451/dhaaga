import MentionInboxPagerView from '#/features/inbox/pages/MentionInboxPagerView';
import ChatInboxPagerView from '#/features/inbox/pages/ChatInboxPagerView';
import SocialInboxPagerView from '#/features/inbox/pages/SocialInboxPagerView';
import UpdatesInboxPagerView from '#/features/inbox/pages/UpdatesInboxPagerView';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { InboxCtx } from '@dhaaga/core';
import { AppPagerView } from '#/ui/PagerView';
import { SubscriptionGalleryCtx } from '@dhaaga/react';
import SubscriptionGalleryWidget from '#/features/inbox/widgets/SubscriptionGalleryWidget';
import WithBackgroundSkin from '#/components/containers/WithBackgroundSkin';

const renderScene = (index: number) => {
	switch (index) {
		case 0:
			return <MentionInboxPagerView />;
		case 1:
			return <ChatInboxPagerView />;
		case 2:
			return <SocialInboxPagerView />;
		case 3:
			return <UpdatesInboxPagerView />;
		default:
			throw new Error('Invalid tab index for inbox tab');
	}
};

/**
 * Wrap by SubscriptionGalleryCtx is intended
 *
 * A small price to be able to embed the widget
 * @constructor
 */
function Page() {
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	const tabLabels = [
		{
			label: t(`inbox.nav.mentions`),
			id: 'mentions',
		},
		{
			label: t(`inbox.nav.chat`),
			id: 'social',
		},
		{
			label: t(`inbox.nav.social`),
			id: 'chat',
		},
		{
			label: t(`inbox.nav.updates`),
			id: 'updates',
		},
	];

	return (
		<SubscriptionGalleryCtx>
			<WithBackgroundSkin>
				<AppPagerView
					renderScene={(i: number) => <InboxCtx>{renderScene(i)}</InboxCtx>}
					tabCount={4}
					labels={tabLabels}
					showBottomNav
					scrollEnabled={false}
				/>
			</WithBackgroundSkin>
		</SubscriptionGalleryCtx>
	);
}

export default Page;
