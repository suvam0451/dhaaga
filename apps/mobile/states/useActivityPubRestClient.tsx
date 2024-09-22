import {
	createContext,
	MutableRefObject,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import {
	ActivityPubClientFactory,
	ActivityPubUserAdapter,
	ActivityPubClient,
	UserInterface,
	KNOWN_SOFTWARE,
} from '@dhaaga/shared-abstraction-activitypub';
import { mastodon } from '@dhaaga/shared-provider-mastodon';
import { useGlobalMmkvContext } from './useGlobalMMkvCache';
import AtprotoSessionService from '../services/atproto/atproto-session.service';
import { Accounts } from '../database/entities/account';
import { getLiveClient, schema } from '../database/client';
import { eq } from 'drizzle-orm';

type Type = {
	client: ActivityPubClient;
	me: UserInterface | null;
	meRaw: mastodon.v1.Account | null;
	primaryAcct: Accounts;
	PrimaryAcctPtr: MutableRefObject<Accounts>;

	/**
	 * Call this function after change in
	 * primary account selection/active status
	 */
	regenerate: () => void;

	domain?: string;
	subdomain?: string;
	_id?: string;
};

const defaultValue: Type = {
	client: null,
	me: null,
	meRaw: null,
	primaryAcct: null,
	regenerate: () => {},
	PrimaryAcctPtr: undefined,
};

const ActivityPubRestClientContext = createContext<Type>(defaultValue);

const client = getLiveClient();

export function useActivityPubRestClientContext() {
	return useContext(ActivityPubRestClientContext);
}

/**
 * Stores the currently active account and corresponding
 * api client reference
 * @param children
 * @constructor
 */
function WithActivityPubRestClient({ children }: any) {
	const [restClient, setRestClient] = useState<ActivityPubClient>(null);
	const [Me, setMe] = useState(null);
	const [MeRaw, setMeRaw] = useState(null);
	// const db = useRealm();
	const [PrimaryAcct, setPrimaryAcct] = useState<Accounts>(null);

	const PrimaryAcctPtr = useRef<Accounts>(null);

	const { globalDb } = useGlobalMmkvContext();

	async function regenerateFn() {
		const acct = await client.query.account.findFirst({
			where: eq(schema.account.selected, true),
			with: {
				meta: true,
			},
		});
		if (!acct) {
			setRestClient(null);
			setPrimaryAcct(null);
			PrimaryAcctPtr.current = null;
			return;
		}

		const token = acct.meta.find((o) => o.key === 'access_token')?.value;
		if (!token) {
			setRestClient(null);
			return;
		}

		let payload: any = {
			instance: acct?.server,
			token,
		};

		// Built Different
		if (acct.software === KNOWN_SOFTWARE.BLUESKY) {
			const session = AtprotoSessionService.create(acct);
			await session.resume();
			const { success, data, reason } = await session.saveSession();
			if (!success)
				console.log('[INFO]: session restore status', success, reason);
			payload = {
				...data,
				subdomain: acct.server,
			};
		}

		const _client = ActivityPubClientFactory.get(acct.software as any, payload);
		setRestClient(_client);
		setPrimaryAcct(acct);
		PrimaryAcctPtr.current = acct;
		// FIXME: fix this
		// EmojiService.refresh(db, globalDb, acct.server, true);
	}

	useEffect(() => {
		regenerateFn();
	}, []);

	useEffect(() => {
		if (!restClient) {
			setMe(null);
			return;
		}

		restClient.me.getMe().then(({ data, error }) => {
			if (error) {
				console.log('[WARN]: error loading account data (i.e. - me)');
				return;
			}
			setMeRaw(data);
			setMe(ActivityPubUserAdapter(data, PrimaryAcct?.software));
		});
	}, [restClient]);

	return (
		<ActivityPubRestClientContext.Provider
			value={{
				client: restClient,
				me: Me,
				meRaw: MeRaw,
				primaryAcct: PrimaryAcct,
				regenerate: regenerateFn,
				domain: PrimaryAcct?.software,
				subdomain: PrimaryAcct?.server,
				PrimaryAcctPtr,
			}}
		>
			{children}
		</ActivityPubRestClientContext.Provider>
	);
}

export default WithActivityPubRestClient;
