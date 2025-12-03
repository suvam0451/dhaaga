import AppTabLandingNavbar, {
	APP_LANDING_PAGE_TYPE,
} from '../../../components/shared/topnavbar/AppTabLandingNavbar';
import { router } from 'expo-router';
import { APP_ROUTING_ENUM } from '../../../utils/route-list';
import {
	DiscoverStateAction,
	useDiscoverDispatch,
	useDiscoverState,
} from '@dhaaga/core';
import { getSearchTabs } from '@dhaaga/db';
import { useAppApiClient } from '#/hooks/utility/global-state-extractors';

function Header() {
	const { driver } = useAppApiClient();
	const State = useDiscoverState();
	const dispatch = useDiscoverDispatch();

	function changeTab(value: string) {
		dispatch({
			type: DiscoverStateAction.SET_CATEGORY,
			payload: {
				tab: value as any,
			},
		});
	}
	return (
		<AppTabLandingNavbar
			type={APP_LANDING_PAGE_TYPE.DISCOVER}
			menuItems={[
				{
					iconId: 'history',
					onPress: () => {},
				},
				{
					iconId: 'user-guide',
					onPress: () => {
						router.navigate(APP_ROUTING_ENUM.DISCOVER_GUIDE);
					},
				},
			]}
			hasDropdown={true}
			dropdownSelectedId={State.tab}
			dropdownItems={getSearchTabs(driver).map((o) => ({
				id: o,
				label: o.charAt(0).toUpperCase() + o.slice(1),
				onSelect: () => {
					changeTab(o);
				},
			}))}
		/>
	);
}

export default Header;
