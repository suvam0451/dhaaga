import {
	ActivitypubStatusAdapter,
	StatusInterface,
} from '@dhaaga/shared-abstraction-activitypub';
import {
	createContext,
	MutableRefObject,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import { mastodon } from '@dhaaga/shared-provider-mastodon';
import MastodonService from '../services/mastodon.service';
import ActivityPubAdapterService from '../services/activitypub-adapter.service';
import useHookLoadingState from './useHookLoadingState';
import useGlobalState from './_global';
import { useShallow } from 'zustand/react/shallow';

type OgObject = {
	url: string;
	title: string;
	siteName: string;
	description: string;
	mediaType: string;
	contentType: string;
	images: string[];
	videos: {
		url: string;
		secureUrl: string;
		type: string;
		width: string;
		height: string;
	}[];
	favicons: string[];
};

type Type = {
	// the current status. could be report. could be a reply.
	status: StatusInterface | null;
	statusContext: StatusContextInterface | null;

	// the original status being reposted
	sharedStatus: StatusInterface | null;
	openGraph: OgObject | null;

	statusRaw: mastodon.v1.Status | any | null;
	setData: (o: StatusInterface) => void;
	setStatusContextData: (data: any) => void;
	setDataRaw: (o: mastodon.v1.Status | any) => void;
	setSharedDataRaw: (o: mastodon.v1.Status | any) => void;
	updateOpenGraph: (og: OgObject | null) => void;
	toggleBookmark: () => void;

	// status context interface
	contextItemLookup: MutableRefObject<Map<string, StatusInterface>>;
	contextChildrenLookup: MutableRefObject<Map<string, StatusInterface[]>>;
	contextRootLookup: MutableRefObject<StatusInterface>;

	// uuid state for forcing re-renders
	stateKey: string;
};

const defaultValue: Type = {
	openGraph: undefined,
	updateOpenGraph(og: OgObject | null): void {},
	setDataRaw(o: mastodon.v1.Status | any): void {},
	setData(o: StatusInterface): void {},
	status: null,
	sharedStatus: null,
	statusRaw: null,
	toggleBookmark: () => {},
	statusContext: undefined,
	setStatusContextData: () => {},
	contextItemLookup: undefined,
	contextChildrenLookup: undefined,
	contextRootLookup: undefined,
	stateKey: '',
	setSharedDataRaw: () => {},
};

const ActivitypubStatusContext = createContext<Type>(defaultValue);

/**
 * When a raw status or it's interface
 * is passed to the parent context of this hook,
 *
 * @return the post, as statusRaw
 * @return the post interface, as status
 * @return any reblogged post, as sharedStatus
 *
 * @returns status
 * @returns sharedStatus
 */
export function useActivitypubStatusContext() {
	return useContext(ActivitypubStatusContext);
}

type Props = {
	status?: mastodon.v1.Status | any;
	statusInterface?: StatusInterface;
	children: any;
};

function WithActivitypubStatusContext({
	status,
	statusInterface,
	children,
}: Props) {
	const { acct, client, driver } = useGlobalState(
		useShallow((o) => ({
			acct: o.acct,
			client: o.router,
			driver: o.driver,
		})),
	);
	const { State, forceUpdate } = useHookLoadingState();

	/**
	 * Storing raw object and interfaces for:
	 * Status and RebloggedStatus
	 */
	const Status = useRef<StatusInterface>(
		ActivitypubStatusAdapter(null, driver),
	);
	const StatusRaw = useRef<mastodon.v1.Status | any | null>(null);
	const SharedStatus = useRef<StatusInterface>(
		ActivitypubStatusAdapter(null, driver),
	);
	const SharedStatusRaw = useRef<mastodon.v1.Status | any | null>(null);

	const StatusContext = useRef<StatusContextInterface>(
		ActivityPubStatusContextAdapter(null, driver),
	);

	const contextItemLookup = useRef<Map<string, StatusInterface>>();
	const contextChildrenLookup = useRef<Map<string, StatusInterface[]>>();
	const contextRootLookup = useRef<StatusInterface>();

	const [OpenGraph, setOpenGraph] = useState<OgObject | null>(null);

	// init
	useEffect(() => {
		if (status) {
			console.log(
				'[WARN]: passing raw status to this context is deprecated.' +
					'please consider passing adapted object, instead',
			);
			StatusRaw.current = status;
			const adapted = ActivitypubStatusAdapter(status, driver);
			Status.current = adapted;
			if (adapted.isReposted()) {
				SharedStatus.current = ActivitypubStatusAdapter(
					adapted.getRepostedStatusRaw(),
					driver,
				);
				SharedStatusRaw.current = adapted.getRepostedStatusRaw();
			}
		} else if (statusInterface) {
			Status.current = statusInterface;
			StatusRaw.current = statusInterface?.getRaw();
			if (statusInterface.isReposted()) {
				SharedStatus.current = ActivitypubStatusAdapter(
					statusInterface.getRepostedStatusRaw(),
					driver,
				);
				SharedStatusRaw.current = statusInterface.getRepostedStatusRaw();
			}
		}
		forceUpdate();
	}, [status, statusInterface]);

	function setStatusContextData(data: mastodon.v1.Context | any) {
		const { root, itemLookup, childrenLookup } = MastodonService.solveContext(
			Status.current,
			data,
		);
		contextRootLookup.current = root;
		contextItemLookup.current = itemLookup;
		contextChildrenLookup.current = childrenLookup;
		forceUpdate();
	}

	const setData = useCallback((o: StatusInterface) => {
		Status.current = o;
		forceUpdate();
	}, []);

	const setDataRaw = useCallback((o: mastodon.v1.Status | any) => {
		const adapted = ActivitypubStatusAdapter(o, driver);
		if (adapted.isReposted()) {
			SharedStatus.current = ActivitypubStatusAdapter(
				adapted.getRepostedStatusRaw(),
				driver,
			);
		}
		Status.current = adapted;
		forceUpdate();
	}, []);

	const setSharedDataRaw = useCallback((o: mastodon.v1.Status | any) => {
		SharedStatus.current = ActivityPubAdapterService.adaptStatus(o, driver);
		forceUpdate();
	}, []);

	const updateOpenGraph = useCallback((og: any) => {
		setOpenGraph(og);
	}, []);

	const toggleBookmark = useCallback(async () => {
		if (!client) return;

		if (Status.current?.getIsBookmarked()) {
			const { data, error } = await client.statuses.bookmark(
				Status.current.getId(),
			);
			if (error) {
				console.log('[WARN]: unable to bookmark');
				return;
			}
			setDataRaw(data);
		} else {
			const { data, error } = await client.statuses.unBookmark(
				Status.current.getId(),
			);
			if (error) {
				console.log('[WARN]: unable to bookmark');
				return;
			}
			setDataRaw(data);
		}

		forceUpdate();
	}, []);

	return (
		<ActivitypubStatusContext.Provider
			value={{
				status: Status.current,
				statusContext: StatusContext.current,
				openGraph: OpenGraph,
				sharedStatus: SharedStatus.current,
				statusRaw: StatusRaw.current,
				setData,
				setDataRaw,
				toggleBookmark,
				updateOpenGraph,
				setStatusContextData,
				contextItemLookup,
				contextChildrenLookup,
				contextRootLookup,
				stateKey: State,
				setSharedDataRaw,
			}}
		>
			{children}
		</ActivitypubStatusContext.Provider>
	);
}

export default WithActivitypubStatusContext;
