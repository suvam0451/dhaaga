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
import { useRef, useState } from 'react';

function SearchTabInteractor() {
	const { theme } = useAppTheme();
	const { acct } = useAppAcct();
	const { session } = useAppActiveSession();
	const [SearchTerm, setSearchTerm] = useState(null);
	const childRef = useRef(null);

	function onSearch() {
		childRef.current?.onSearch(SearchTerm);
	}

	if (!acct || session.state !== 'valid') return <Redirect href={'/'} />;

	return (
		<View style={{ flex: 1, backgroundColor: theme.palette.bg }}>
			<DiscoverCtx>
				<SearchTabPresenter ref={childRef} />
			</DiscoverCtx>
			<SearchWidget
				SearchTerm={SearchTerm}
				setSearchTerm={setSearchTerm}
				onSearch={onSearch}
			/>
		</View>
	);
}
export default SearchTabInteractor;
