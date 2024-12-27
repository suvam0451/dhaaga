import { memo } from 'react';
import { FetchStatus } from '@tanstack/react-query';
import SearchScreenManual from '../../../../../error-screen/SearchScreenManual';
import AppLoadingIndicator from '../../../../../error-screen/AppLoadingIndicator';
import NoResults from '../../../../../error-screen/NoResults';
import { View } from 'react-native';
import { APP_SEARCH_TYPE } from '../../../api/useSearch';
import AppTabLandingNavbar, {
	APP_LANDING_PAGE_TYPE,
} from '../../../../../shared/topnavbar/AppTabLandingNavbar';

type DiscoverTabIndicatorProps = {
	query: string;
	status: 'error' | 'success' | 'pending';
	fetchStatus: FetchStatus;
	numItems: number;
	category: APP_SEARCH_TYPE;
};

/**
 * Shows various loading and error
 * states for the Discovery module
 */
const DiscoverTabListHeader = memo(
	({ query, status, fetchStatus, numItems }: DiscoverTabIndicatorProps) => {
		return (
			<AppTabLandingNavbar
				type={APP_LANDING_PAGE_TYPE.DISCOVER}
				menuItems={[
					{
						iconId: 'user-guide',
					},
				]}
			/>
		);
		// Idle
		if (!query) return <SearchScreenManual />;

		// Loading Results
		if (fetchStatus === 'fetching' && numItems === 0)
			return <AppLoadingIndicator text={'Loading...'} searchTerm={query} />;

		// No Results
		if (status === 'success' && numItems === 0) {
			return (
				<NoResults text={'No results 🤔'} subtext={'Try a different keyword'} />
			);
		}

		// no Status
		return <View />;
	},
);

export default DiscoverTabListHeader;
