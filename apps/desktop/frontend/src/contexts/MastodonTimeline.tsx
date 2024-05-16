import { mastodon } from "masto";
import { createContext, useContext, useEffect, useState } from "react";
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
 * 1. Loads Home/Local/Federated timelines
 * 2. Deals with pagination (automatic RAM optimisation)
 * 3. Stores min/max ids
 */
function MastodonTimelinesProvider({ children }: any) {
	const providerAuth = useSelector<RootState, ProviderAuthState>(
		(o) => o.providerAuth
	);

	const [MastodonUserStatuses, setMastodonUserStatuses] =
		useState<StoreType>(storeDefault);

	useEffect(() => {
		setMastodonUserStatuses({
			...MastodonUserStatuses,
			loading: true,
		});

		const account = providerAuth.selectedAccount;
		const token = providerAuth.loggedInCredentials["accessToken"];

		if (!token) {
			console.log("token not found");
			return;
		}

		MastadonService.getPublicTimeline(account?.subdomain!, token, {
			maxId: null,
			minId: null,
		})
			.then((res) => {
				const nextMinId = res[0].id;
				const nextMaxId = res[res.length - 1].id;

				setMastodonUserStatuses({
					...MastodonUserStatuses,
					posts: [...res],
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
	}, []);

	async function fetchMore() {
		setMastodonUserStatuses({
			...MastodonUserStatuses,
			loading: true,
		});
		const account = providerAuth.selectedAccount;
		const token = providerAuth.loggedInCredentials["accessToken"];

		if (!token) {
			console.log("token not found");
			return;
		}

		MastadonService.getPublicTimeline(account?.subdomain!, token, {
			maxId: MastodonUserStatuses.maxId,
			minId: null,
		})
			.then((res) => {
				const nextMinId = res[0].id;
				const nextMaxId = res[res.length - 1].id;

				setMastodonUserStatuses({
					...MastodonUserStatuses,
					posts: [...MastodonUserStatuses.posts, ...res],
					minId: nextMinId,
					maxId: nextMaxId,
					loading: false,
					page: MastodonUserStatuses.page + 1,
				});
			})
			.catch((e) => {
				setMastodonUserStatuses({
					...MastodonUserStatuses,
					errored: true,
					loading: false,
				});
			});
	}

	function fetchLatest() {}

	async function fetchNextPage() {}

	return (
		<StoreContext.Provider value={MastodonUserStatuses}>
			<DispatchContext.Provider
				value={{ fetchMore, fetchLatest, fetchNextPage }}
			>
				{children}
			</DispatchContext.Provider>
		</StoreContext.Provider>
	);
}

export function MastodonTimelinesProviderHook() {
	return {
		store: useContext(StoreContext),
		dispatch: useContext(DispatchContext),
	};
}
export default MastodonTimelinesProvider;
