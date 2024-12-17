import { createContext, useContext, useEffect, useState } from 'react';
import {
	ActivityPubUserAdapter,
	ActivityPubClient,
	UserInterface,
} from '@dhaaga/shared-abstraction-activitypub';
import { Account } from '../database/_schema';

type Type = {
	client: ActivityPubClient;
	me: UserInterface | null;
	primaryAcct: Account;

	domain?: string;
	subdomain?: string;
	_id?: string;
};

const defaultValue: Type = {
	client: null,
	me: null,
	// meRaw: null,
	primaryAcct: null,
};

const ActivityPubRestClientContext = createContext<Type>(defaultValue);

/**
 * @deprecated will be replaced with zustand global store
 */
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
	const [PrimaryAcct, setPrimaryAcct] = useState<Account>(null);

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
			// setMeRaw(data);
			setMe(ActivityPubUserAdapter(data, PrimaryAcct?.driver));
		});
	}, [restClient]);

	return (
		<ActivityPubRestClientContext.Provider
			value={{
				client: restClient,
				me: Me,
				primaryAcct: PrimaryAcct,
				domain: PrimaryAcct?.driver,
				subdomain: PrimaryAcct?.server,
			}}
		>
			{children}
		</ActivityPubRestClientContext.Provider>
	);
}

export default WithActivityPubRestClient;
