import { DiscoverCtx } from '@dhaaga/core';
import SearchTabPresenter from '../presenters/SearchTabPresenter';
import {
	useAppAcct,
	useAppActiveSession,
	useAppTheme,
} from '../../../hooks/utility/global-state-extractors';
import { View } from 'react-native';
import SearchWidget from '../components/SearchWidget';
import { Redirect } from 'expo-router';

function SearchTabInteractor() {
	const { theme } = useAppTheme();
	const { acct } = useAppAcct();
	const { session } = useAppActiveSession();

	if (!acct || session.state !== 'valid') return <Redirect href={'/'} />;

	return (
		<DiscoverCtx>
			<View style={{ flex: 1, backgroundColor: theme.palette.bg }}>
				<SearchTabPresenter />
				<SearchWidget />
			</View>
		</DiscoverCtx>
	);
}

export default SearchTabInteractor;
