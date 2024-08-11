import { memo } from 'react';
import { FetchStatus } from '@tanstack/react-query';
import SearchScreenManual from '../../../../../error-screen/SearchScreenManual';
import AppLoadingIndicator from '../../../../../error-screen/AppLoadingIndicator';
import NoResults from '../../../../../error-screen/NoResults';
import { View } from 'react-native';

type DiscoverTabIndicatorProps = {
	query: string;
	status: 'error' | 'success' | 'pending';
	fetchStatus: FetchStatus;
	numItems: number;
};

/**
 * Shows various loading and error
 * states for the Discovery module
 */
const DiscoverTabListHeader = memo(
	({ query, status, fetchStatus, numItems }: DiscoverTabIndicatorProps) => {
		// Idle
		if (!query) return <SearchScreenManual />;

		// Loading Results
		if (fetchStatus === 'fetching' && numItems === 0)
			return <AppLoadingIndicator text={'Loading...'} searchTerm={query} />;

		// No Results
		if (status === 'success' && numItems === 0) {
			return (
				<NoResults
					text={'No results 🤔'}
					subtext={'Try change categories' + ' or' + ' a different keyword'}
				/>
			);
		}

		// no Status
		return <View />;
	},
);

export default DiscoverTabListHeader;
