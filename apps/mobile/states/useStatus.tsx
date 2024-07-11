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
import { useActivityPubRestClientContext } from './useActivityPubRestClient';
import { mastodon } from '@dhaaga/shared-provider-mastodon';
// import { Note } from '@dhaaga/shared-provider-misskey';
import { StatusContextInterface } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/status/_interface';
import { ActivityPubStatusContextAdapter } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/status/_adapters';
import MastodonService from '../services/mastodon.service';
import { randomUUID } from 'expo-crypto';

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
	setStatusContextData: function (data: any): void {
		throw new Error('Function not implemented.');
	},
	contextItemLookup: undefined,
	contextChildrenLookup: undefined,
	contextRootLookup: undefined,
	stateKey: '',
};

const ActivitypubStatusContext = createContext<Type>(defaultValue);

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
	const { primaryAcct, client } = useActivityPubRestClientContext();
	const _domain = primaryAcct?.domain;

	const [StateKey, setStateKey] = useState(randomUUID());
	const [Status, setStatus] = useState<StatusInterface | null>(
		ActivitypubStatusAdapter(null, _domain),
	);

	const [StatusContext, setStatusContext] =
		useState<StatusContextInterface | null>(
			ActivityPubStatusContextAdapter(null, _domain),
		);

	const contextItemLookup = useRef<Map<string, StatusInterface>>();
	const contextChildrenLookup = useRef<Map<string, StatusInterface[]>>();
	const contextRootLookup = useRef<StatusInterface>();

	const [SharedStatus, setSharedStatus] = useState<StatusInterface | null>(
		ActivitypubStatusAdapter(null, _domain),
	);

	const [StatusRaw, setStatusRaw] = useState<mastodon.v1.Status | any | null>(
		null,
	);
	const [OpenGraph, setOpenGraph] = useState<OgObject | null>(null);

	// init
	useEffect(() => {
		if (status) {
			console.log(
				'[WARN]: passing raw status to this context is deprecated.' +
					'please consider passing adapted object, instead',
			);
			setStatusRaw(status);
			const adapted = ActivitypubStatusAdapter(status, _domain);
			setStatus(adapted);
			if (adapted.isReposted()) {
				const repostAdapted = ActivitypubStatusAdapter(
					adapted.getRepostedStatusRaw(),
					_domain,
				);
				setSharedStatus(repostAdapted);
			}
		} else if (statusInterface) {
			setStatus(statusInterface);
			console.log('[INFO]: setting raw status as', statusInterface?.getRaw());
			setStatusRaw(statusInterface?.getRaw());
			if (statusInterface.isReposted()) {
				const repostAdapted = ActivitypubStatusAdapter(
					statusInterface.getRepostedStatusRaw(),
					_domain,
				);
				setSharedStatus(repostAdapted);
			}
		}
	}, [status, statusInterface]);

	function setStatusContextData(data: mastodon.v1.Context | any) {
		const { root, itemLookup, childrenLookup } = MastodonService.solveContext(
			Status,
			data,
			_domain,
		);
		contextRootLookup.current = root;
		contextItemLookup.current = itemLookup;
		contextChildrenLookup.current = childrenLookup;
		setStateKey(randomUUID());
	}

	const setData = useCallback((o: StatusInterface) => {
		setStatus(o);
	}, []);

	const setDataRaw = useCallback((o: mastodon.v1.Status | any) => {
		const adapted = ActivitypubStatusAdapter(o, _domain);
		if (adapted.isReposted()) {
			const repostAdapted = ActivitypubStatusAdapter(
				adapted.getRepostedStatusRaw(),
				_domain,
			);
			setSharedStatus(repostAdapted);
		}
		setStatus(adapted);
	}, []);

	const updateOpenGraph = useCallback((og: any) => {
		setOpenGraph(og);
	}, []);

	const toggleBookmark = useCallback(async () => {
		if (!client) return;
		try {
			if (Status?.getIsBookmarked()) {
				const res = await client.unBookmark(Status.getId());
				setDataRaw(res);
			} else {
				const res = await client.bookmark(Status.getId());
				setDataRaw(res);
			}
		} catch (e) {
			console.log('[ERROR] : toggling bookmark');
		}
	}, []);

	return (
		<ActivitypubStatusContext.Provider
			value={{
				status: Status,
				statusContext: StatusContext,
				openGraph: OpenGraph,
				sharedStatus: SharedStatus,
				statusRaw: StatusRaw,
				setData,
				setDataRaw,
				toggleBookmark,
				updateOpenGraph,
				setStatusContextData,
				contextItemLookup,
				contextChildrenLookup,
				contextRootLookup,
				stateKey: StateKey,
			}}
		>
			{children}
		</ActivitypubStatusContext.Provider>
	);
}

export default WithActivitypubStatusContext;
