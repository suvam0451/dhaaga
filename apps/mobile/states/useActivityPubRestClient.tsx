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
import AtprotoSessionService from '../services/atproto/atproto-session.service';
import { useSQLiteContext } from 'expo-sqlite';
import { Account } from '../database/_schema';
import { AccountService } from '../database/entities/account';
import { AccountMetadataService } from '../database/entities/account-metadata';

type Type = {
	client: ActivityPubClient;
	me: UserInterface | null;
	meRaw: mastodon.v1.Account | null;
	primaryAcct: Account;
	PrimaryAcctPtr: MutableRefObject<Account>;

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
	const db = useSQLiteContext();
	const [restClient, setRestClient] = useState<ActivityPubClient>(null);
	const [Me, setMe] = useState(null);
	const [MeRaw, setMeRaw] = useState(null);
	const [PrimaryAcct, setPrimaryAcct] = useState<Account>(null);

	const PrimaryAcctPtr = useRef<Account>(null);

	async function regenerateFn() {
		const acct = await AccountService.getSelected(db);
		if (!acct) {
			setRestClient(null);
			setPrimaryAcct(null);
			PrimaryAcctPtr.current = null;
			return;
		}

		const token = await AccountMetadataService.getKeyValueForAccountSync(
			db,
			acct,
			'access_token',
		);
		if (!token) {
			setRestClient(null);
			return;
		}

		let payload: any = {
			instance: acct?.server,
			token,
		};

		// Built Different
		if (acct.driver === KNOWN_SOFTWARE.BLUESKY) {
			const session = AtprotoSessionService.create(db, acct);
			await session.resume();
			const { success, data, reason } = await session.saveSession();
			if (!success)
				console.log('[INFO]: session restore status', success, reason);
			payload = {
				...data,
				subdomain: acct.server,
			};
		}

		const _client = ActivityPubClientFactory.get(acct.driver as any, payload);
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
			setMe(ActivityPubUserAdapter(data, PrimaryAcct?.driver));
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
				domain: PrimaryAcct?.driver,
				subdomain: PrimaryAcct?.server,
				PrimaryAcctPtr,
			}}
		>
			{children}
		</ActivityPubRestClientContext.Provider>
	);
}

export default WithActivityPubRestClient;
