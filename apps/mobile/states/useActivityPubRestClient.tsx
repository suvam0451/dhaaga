import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';
import {
	ActivityPubClientFactory,
	ActivityPubUserAdapter,
	MastodonRestClient,
	MisskeyRestClient,
	UnknownRestClient,
	UserInterface,
} from '@dhaaga/shared-abstraction-activitypub';
import { mastodon } from '@dhaaga/shared-provider-mastodon';
import AccountRepository from '../repositories/account.repo';
import { useRealm, useQuery } from '@realm/react';
import { Account } from '../entities/account.entity';
import { EmojiService } from '../services/emoji.service';
import { useGlobalMmkvContext } from './useGlobalMMkvCache';
import AccountService from '../services/account.service';

type Type = {
	client: MastodonRestClient | MisskeyRestClient | UnknownRestClient | null;
	me: UserInterface | null;
	meRaw: mastodon.v1.Account | null;
	primaryAcct: Account;
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
	regenerate: function (): void {
		throw new Error('Function not implemented.');
	},
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
	const [restClient, setRestClient] = useState<
		MastodonRestClient | MisskeyRestClient | UnknownRestClient | null
	>(null);
	const [Me, setMe] = useState(null);
	const [MeRaw, setMeRaw] = useState(null);
	const db = useRealm();
	const [PrimaryAcct, setPrimaryAcct] = useState<Account>(null);
	const { globalDb } = useGlobalMmkvContext();
	const accounts = useQuery(Account);

	const regenerateFn = useCallback(() => {
		const acct = accounts.find((o) => o.selected === true);
		if (!acct) {
			setRestClient(null);
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
		EmojiService.loadEmojisForInstance(db, globalDb, acct.subdomain);
		AccountService.loadFollowedTags(db, client);
	}, [accounts]);

	useEffect(() => {
		regenerateFn();
	}, []);

	useEffect(() => {
		if (!restClient) {
			setMe(null);
			return;
		}

		restClient.getMe().then((res) => {
			setMeRaw(res);
			setMe(ActivityPubUserAdapter(res, PrimaryAcct?.domain));
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
			}}
		>
			{children}
		</ActivityPubRestClientContext.Provider>
	);
}

export default WithActivityPubRestClient;
