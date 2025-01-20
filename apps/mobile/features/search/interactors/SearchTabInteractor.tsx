import DiscoverTabCtx from '../contexts/DiscoverTabCtx';
import SearchTabPresenter from '../presenters/SearchTabPresenter';
import {
	useAppAcct,
	useAppTheme,
} from '../../../hooks/utility/global-state-extractors';
import AppNoAccount from '../../../components/error-screen/AppNoAccount';
import { APP_LANDING_PAGE_TYPE } from '../../../components/shared/topnavbar/AppTabLandingNavbar';
import { View } from 'react-native';
import SearchWidget from '../components/SearchWidget';

function WithSearchBar({ children }: any) {
	const { theme } = useAppTheme();
	const { acct } = useAppAcct();

	if (!acct) return <AppNoAccount tab={APP_LANDING_PAGE_TYPE.DISCOVER} />;

	return (
		<View style={{ height: '100%', backgroundColor: theme.palette.bg }}>
			{children}
			<SearchWidget />
		</View>
	);
}

function SearchTabInteractor() {
	return (
		<DiscoverTabCtx>
			<WithSearchBar>
				<SearchTabPresenter />
			</WithSearchBar>
		</DiscoverTabCtx>
	);
}

export default SearchTabInteractor;
