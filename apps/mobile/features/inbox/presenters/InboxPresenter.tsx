import { useAppTheme } from '#/hooks/utility/global-state-extractors';
import MentionPresenter from './MentionPresenter';
import ChatroomPresenter from './ChatroomPresenter';
import SocialUpdatePresenter from './SocialUpdatePresenter';
import UpdatesPresenter from './UpdatesPresenter';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { InboxCtx } from '@dhaaga/core';
import { AppPagerView } from '#/ui/PagerView';

const renderScene = (index: number) => {
	switch (index) {
		case 0:
			return <MentionPresenter />;
		case 1:
			return <ChatroomPresenter />;
		case 2:
			return <SocialUpdatePresenter />;
		case 3:
			return <UpdatesPresenter />;
		default:
			throw new Error('Invalid tab index for inbox tab');
	}
};

function InboxPresenter() {
	const { theme } = useAppTheme();
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
		<AppPagerView
			renderScene={(i: number) => <InboxCtx>{renderScene(i)}</InboxCtx>}
			tabCount={4}
			labels={tabLabels}
			showBottomNav
			props={{ backgroundColor: theme.background.a0 }}
		/>
	);
}

export default InboxPresenter;
