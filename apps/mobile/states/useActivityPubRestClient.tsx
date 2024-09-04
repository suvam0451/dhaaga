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
} from '@dhaaga/shared-abstraction-activitypub';
import { mastodon } from '@dhaaga/shared-provider-mastodon';
import AccountRepository from '../repositories/account.repo';
import { useRealm } from '@realm/react';
import { Account } from '../entities/account.entity';
import { EmojiService } from '../services/emoji.service';
import { useGlobalMmkvContext } from './useGlobalMMkvCache';
import { UUID } from 'bson';

type Type = {
	client: ActivityPubClient;
	me: UserInterface | null;
	meRaw: mastodon.v1.Account | null;
	primaryAcct: Account;
	PrimaryAcctPtr: MutableRefObject<UUID>;

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
	const [restClient, setRestClient] = useState<ActivityPubClient>(null);
	const [Me, setMe] = useState(null);
	const [MeRaw, setMeRaw] = useState(null);
	const db = useRealm();
	const [PrimaryAcct, setPrimaryAcct] = useState<Account>(null);

	const PrimaryAcctPtr = useRef<UUID>(null);

	const { globalDb } = useGlobalMmkvContext();

	function regenerateFn() {
		const acct = db.objects(Account).find((o: Account) => o.selected === true);
		if (!acct) {
			setRestClient(null);
			setPrimaryAcct(null);
			PrimaryAcctPtr.current = null;
			return;
		}

		const token = AccountRepository.findSecret(db, acct, 'access_token')?.value;
		if (!token) {
			setRestClient(null);
			return;
		}

		const client = ActivityPubClientFactory.get(acct.domain as any, {
			instance: acct?.subdomain,
			token,
		});
		setRestClient(client);
		setPrimaryAcct(acct);
		PrimaryAcctPtr.current = acct._id;
		EmojiService.refresh(db, globalDb, acct.subdomain, true).then((res) => {
			// console.log(
			// 	'[INFO]: emoji cache refreshed for account',
			// 	acct.subdomain,
			// 	res?.length,
			// );
		});
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
			setMe(ActivityPubUserAdapter(data, PrimaryAcct?.domain));
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
				domain: PrimaryAcct?.domain,
				subdomain: PrimaryAcct?.subdomain,
				PrimaryAcctPtr,
			}}
		>
			{children}
		</ActivityPubRestClientContext.Provider>
	);
}

export default WithActivityPubRestClient;
