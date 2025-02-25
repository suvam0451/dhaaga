import { DiscoverCtx } from '@dhaaga/core';
import SearchTabPresenter from '../presenters/SearchTabPresenter';
import {
	useAppAcct,
	useAppTheme,
} from '../../../hooks/utility/global-state-extractors';
import AddAccountPresenter from '../../onboarding/presenters/AddAccountPresenter';
import { APP_LANDING_PAGE_TYPE } from '../../../components/shared/topnavbar/AppTabLandingNavbar';
import { View } from 'react-native';
import SearchWidget from '../components/SearchWidget';

function SearchTabInteractor() {
	const { theme } = useAppTheme();
	const { acct } = useAppAcct();

	if (!acct)
		return <AddAccountPresenter tab={APP_LANDING_PAGE_TYPE.DISCOVER} />;

	return (
		<DiscoverCtx>
			<View style={{ height: '100%', backgroundColor: theme.palette.bg }}>
				<SearchTabPresenter />
				<SearchWidget />
			</View>
		</DiscoverCtx>
	);
}

export default SearchTabInteractor;
