import { useEffect } from 'react';
import TabView from './views/TabView';
import { View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import useGlobalState from '../../../../states/_global';
import AppNoAccount from '../../../error-screen/AppNoAccount';
import { APP_LANDING_PAGE_TYPE } from '../../../shared/topnavbar/AppTabLandingNavbar';
import { useAppTheme } from '../../../../hooks/utility/global-state-extractors';

function LandingPageStack() {
	const { theme } = useAppTheme();
	const { acct } = useGlobalState(
		useShallow((o) => ({
			acct: o.acct,
		})),
	);
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

	return (
		<View style={{ height: '100%', backgroundColor: theme.palette.bg }}>
			<TabView />
		</View>
	);
}

export default LandingPageStack;
