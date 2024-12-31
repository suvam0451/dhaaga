import WithAppNotifSeenContext from '../../../components/screens/notifications/landing/state/useNotifSeen';
import {
	useAppAcct,
	useAppTheme,
} from '../../../hooks/utility/global-state-extractors';
import { useEffect, useState } from 'react';
import AppNoAccount from '../../../components/error-screen/AppNoAccount';
import { APP_LANDING_PAGE_TYPE } from '../../../components/shared/topnavbar/AppTabLandingNavbar';
import { View } from 'react-native';
import MentionView from '../../../components/screens/notifications/landing/views/MentionView';
import ChatView from '../../../components/screens/notifications/landing/views/ChatView';
import SocialView from '../../../components/screens/notifications/landing/views/SocialView';
import UpdatesView from '../../../components/screens/notifications/landing/views/UpdatesView';
import { AppPagerView } from '../../../components/lib/AppPagerView';
import { BottomNavBar } from '../../../components/shared/pager-view/BottomNavBar';

const renderScene = (index: number) => {
	switch (index) {
		case 0:
			return <MentionView />;
		case 1:
			return <ChatView />;
		case 2:
			return <SocialView />;
		case 3:
			return <UpdatesView />;
		default:
			return null;
	}
};

function Page() {
	const { theme } = useAppTheme();
	const { acct } = useAppAcct();
	const [Index, setIndex] = useState<any>(0);

	function onChipSelect(index: number) {
		if (Index !== index) {
			setIndex(index);
		}
	}

	useEffect(() => {
		const intervalFunction = () => {
			// refetch();
		};
		const intervalId = setInterval(intervalFunction, 15000);
		return () => {
			clearInterval(intervalId);
		};
	}, []);

	if (!acct) return <AppNoAccount tab={APP_LANDING_PAGE_TYPE.INBOX} />;

	const tabLabels = [
		{
			label: 'Mentions',
			id: 'mentions',
		},
		{
			label: 'Chat',
			id: 'social',
		},
		{
			label: 'Social',
			id: 'chat',
		},
		{
			label: 'Updates',
			id: 'updates',
		},
	];

	return (
		<WithAppNotifSeenContext>
			<View style={{ height: '100%', backgroundColor: theme.palette.bg }}>
				<AppPagerView
					pageCount={4}
					renderFunction={renderScene}
					onPageChangeCallback={onChipSelect}
					Index={Index}
					setIndex={setIndex}
				/>
				<BottomNavBar
					Index={Index}
					setIndex={onChipSelect}
					items={tabLabels}
					justify={'space-between'}
				/>
			</View>
		</WithAppNotifSeenContext>
	);
}

export default Page;
