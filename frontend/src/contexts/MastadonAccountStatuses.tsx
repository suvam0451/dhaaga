import { mastodon } from "masto";
import { useContext, createContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../lib/redux/store";
import { ProviderAuthState } from "../lib/redux/slices/authSlice";
import { MastadonService } from "../services/mastadon.service";

type StoreType = {
	posts: mastodon.v1.Status[];
	minId: string | null;
	maxId: string | null;
	loading: boolean;
	endOfFeed: boolean;
	firstLoadFinished: boolean;
	errored: boolean;
	page: number;
};

type DispatchType = {
	fetchMore: () => void;
	fetchLatest: () => void;
	fetchNextPage: () => void;
};

const storeDefault = {
	posts: [],
	minId: null,
	maxId: null,
	loading: false,
	endOfFeed: false,
	firstLoadFinished: false,
	errored: false,
	page: 0,
};

const dispatchDefault = {
	fetchMore: () => {},
	fetchLatest: () => {},
	fetchNextPage: () => {},
};

const StoreContext = createContext<StoreType>(storeDefault);
const DispatchContext = createContext<DispatchType>(dispatchDefault);

/**
 * 1. Loads posts for a profile,
 * 2. Deals with pagination (RAM optimisation)
 * 3. Stores min/max ids
 * 4. API Loading context
 * 5. Load More function
 * @param param0
 * @returns
 */
function MastadonAccountStatusesProvider({ query, children }: any) {
	const providerAuth = useSelector<RootState, ProviderAuthState>(
		(o) => o.providerAuth
	);

	const [MastodonUserStatuses, setMastodonUserStatuses] =
		useState<StoreType>(storeDefault);

	useEffect(() => {
		const account = providerAuth.selectedAccount;
		const token = providerAuth.loggedInCredentials["accessToken"];

		if (!token) {
			console.log("token not found");
			return;
		}

		setMastodonUserStatuses({
			...MastodonUserStatuses,
			loading: true,
		});
		MastadonService.getPostsForAccount(
			account?.subdomain!,
			token,
			query.userId as unknown as string,
			{
				minId: null,
				maxId: null,
			}
		)
			.then((res) => {
				const nextMinId = res[0].id;
				const nextMaxId = res[res.length - 1].id;
				setMastodonUserStatuses({
					...MastodonUserStatuses,
					posts: res,
					minId: nextMinId,
					maxId: nextMaxId,
					firstLoadFinished: true,
					loading: false,
					page: 1,
				});
			})
			.catch((e) => {
				setMastodonUserStatuses({
					...MastodonUserStatuses,
					errored: true,
					loading: false,
				});
			});
	}, [query.userId]);

	// dispatchers

	async function fetchMore() {
		if (MastodonUserStatuses.loading) return;
		const account = providerAuth.selectedAccount;
		const token = providerAuth.loggedInCredentials["accessToken"];

		setMastodonUserStatuses({
			...MastodonUserStatuses,
			loading: true,
		});
		try {
			const newPosts = await MastadonService.getPostsForAccount(
				account?.subdomain!,
				token,
				query.userId as unknown as string,
				{
					minId: null,
					maxId: MastodonUserStatuses.maxId,
				}
			);
			const posts = MastodonUserStatuses.posts.concat(newPosts);
			const nextMaxId = newPosts[newPosts.length - 1].id;
			setMastodonUserStatuses({
				...MastodonUserStatuses,
				posts,
				minId: MastodonUserStatuses.minId,
				maxId: nextMaxId,
				loading: false,
			});
		} catch (e) {
			setMastodonUserStatuses({
				...MastodonUserStatuses,
				errored: true,
				loading: false,
			});
		}
	}

	function fetchLatest() {}

	async function fetchNextPage() {
		if (MastodonUserStatuses.loading) return;
		const account = providerAuth.selectedAccount;
		const token = providerAuth.loggedInCredentials["accessToken"];

		setMastodonUserStatuses({
			...MastodonUserStatuses,
			loading: true,
		});
		try {
			const newPosts = await MastadonService.getPostsForAccount(
				account?.subdomain!,
				token,
				query.userId as unknown as string,
				{
					minId: null,
					maxId: MastodonUserStatuses.maxId,
				}
			);
			const nextMaxId = newPosts[newPosts.length - 1].id;
			setMastodonUserStatuses({
				...MastodonUserStatuses,
				posts: newPosts,
				minId: MastodonUserStatuses.minId,
				maxId: nextMaxId,
				loading: false,
				page: MastodonUserStatuses.page + 1,
			});
		} catch (e) {
			setMastodonUserStatuses({
				...MastodonUserStatuses,
				errored: true,
				loading: false,
			});
		}
	}
	return (
		<StoreContext.Provider value={MastodonUserStatuses}>
			<DispatchContext.Provider
				value={{
					fetchMore,
					fetchLatest,
					fetchNextPage,
				}}
			>
				{children}
			</DispatchContext.Provider>
		</StoreContext.Provider>
	);
}

export function useMastadonAccountStatusesStoreHook() {
	return {
		store: useContext(StoreContext),
		dispatch: useContext(DispatchContext),
	};
}

export default MastadonAccountStatusesProvider;
