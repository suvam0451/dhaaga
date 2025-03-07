import {
	useAppAcct,
	useAppTheme,
} from '../../../hooks/utility/global-state-extractors';
import AddAccountPresenter from '../../onboarding/presenters/AddAccountPresenter';
import { APP_LANDING_PAGE_TYPE } from '../../../components/shared/topnavbar/AppTabLandingNavbar';
import { View } from 'react-native';
import MentionPresenter from './MentionPresenter';
import ChatroomPresenter from './ChatroomPresenter';
import SocialUpdatePresenter from './SocialUpdatePresenter';
import UpdatesPresenter from './UpdatesPresenter';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../types/app.types';
import { InboxCtx } from '@dhaaga/core';
import { AppPagerView } from '../../../ui/PagerView';

const renderScene = (index: number) => {
	switch (index) {
		case 0:
			return (
				<InboxCtx>
					<MentionPresenter />
				</InboxCtx>
			);
		case 1:
			return (
				<InboxCtx>
					<ChatroomPresenter />
				</InboxCtx>
			);
		case 2:
			return (
				<InboxCtx>
					<SocialUpdatePresenter />;
				</InboxCtx>
			);
		case 3:
			return (
				<InboxCtx>
					<UpdatesPresenter />
				</InboxCtx>
			);
		default:
			return <View />;
	}
};

function InboxPresenter() {
	const { theme } = useAppTheme();
	const { acct } = useAppAcct();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	if (!acct) return <AddAccountPresenter tab={APP_LANDING_PAGE_TYPE.INBOX} />;

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
			renderScene={renderScene}
			tabCount={4}
			labels={tabLabels}
			showBottomNav
			props={{ backgroundColor: theme.background.a0 }}
		/>
	);
}

export default InboxPresenter;
