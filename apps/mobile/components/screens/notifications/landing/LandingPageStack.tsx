import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import { useEffect } from 'react';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../shared/topnavbar/AppTopNavbar';
import TabView from './views/TabView';

function LandingPageStack() {
	const { translateY } = useScrollMoreOnPageEnd({
		itemCount: 0,
		updateQueryCache: () => {},
	});

	useEffect(() => {
		const intervalFunction = () => {
			// refetch();
		};
		const intervalId = setInterval(intervalFunction, 15000);
		return () => {
			clearInterval(intervalId);
		};
	}, []);

	return (
		<AppTopNavbar
			type={APP_TOPBAR_TYPE_ENUM.LANDING_GENERIC}
			title={'Chat & Notifications'}
			translateY={translateY}
		>
			<TabView />
		</AppTopNavbar>
	);
}

export default LandingPageStack;
