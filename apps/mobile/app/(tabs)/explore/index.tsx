import { View } from 'react-native';
import { Redirect } from 'expo-router';
import {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';
import {
	DiscoverCtx,
	DiscoverStateAction,
	useDiscoverDispatch,
	useDiscoverState,
} from '@dhaaga/core';
import {
	useAppAcct,
	useAppActiveSession,
	useAppApiClient,
	useAppTheme,
} from '#/hooks/utility/global-state-extractors';
import SearchWidget from '#/features/search/components/SearchWidget';
import { getSearchTabs } from '@dhaaga/db';
import SearchResultPresenter from '#/features/search/presenters/SearchResultPresenter';

/**
 * Renders the results of a
 * search query in the discovery tab
 */
const Content = forwardRef((props, ref) => {
	const { driver } = useAppApiClient();
	const State = useDiscoverState();
	const dispatch = useDiscoverDispatch();

	useImperativeHandle(ref, () => ({
		onSearch(searchTerm: string) {
			dispatch({
				type: DiscoverStateAction.SET_SEARCH,
				payload: {
					q: searchTerm,
				},
			});
			dispatch({
				type: DiscoverStateAction.APPLY_SEARCH,
			});
		},
	}));

	useEffect(() => {
		dispatch({
			type: DiscoverStateAction.CLEAR_SEARCH,
		});
	}, []);

	/**
	 * Set the default search tab for the
	 * given software driver
	 */
	useEffect(() => {
		const searchTabs = getSearchTabs(driver);

		dispatch({
			type: DiscoverStateAction.SET_CATEGORY,
			payload: {
				tab: searchTabs.find((o) => o === State.tab)
					? searchTabs.find((o) => o === State.tab)
					: searchTabs[0],
			},
		});
	}, [driver]);

	return <SearchResultPresenter refetch={async () => {}} />;
});

function Page() {
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
				<Content ref={childRef} />
			</DiscoverCtx>
			<SearchWidget
				SearchTerm={SearchTerm}
				setSearchTerm={setSearchTerm}
				onSearch={onSearch}
			/>
		</View>
	);
}

export default Page;
