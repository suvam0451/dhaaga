import { createContext, useContext, useEffect, useState } from 'react';
import { Accounts } from '../../../../../../database/entities/account';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { getLiveClient } from '../../../../../../database/client';
import AccountDbService from '../../../../../../database/services/account.service';
import { useActivityPubRestClientContext } from '../../../../../../states/useActivityPubRestClient';

type Type = {
	accounts: Accounts[];
	toggleSelect: (id: number) => void;
	remove: (id: number) => void;
};

const defaultValue: Type = {
	accounts: [],
	toggleSelect: undefined,
	remove: undefined,
};

const AccountDbContext = createContext<Type>(defaultValue);

export function useAccountDbContext() {
	return useContext(AccountDbContext);
}

type Props = {
	children: any;
};

const client = getLiveClient();

function WithAccountDbContext({ children }: Props) {
	const { regenerate } = useActivityPubRestClientContext();
	const [Data, setData] = useState<Accounts[]>([]);
	const { data } = useLiveQuery(
		client.query.account.findMany({
			with: {
				meta: true,
			},
		}),
	);

	useEffect(() => {
		setData(data);
	}, [data]);

	async function _refresh() {
		client.query.account
			.findMany({
				with: {
					meta: true,
				},
			})
			.then((res) => {
				setData(res);
			})
			.catch((e) => {
				console.log(e);
				setData([]);
			})
			.finally(() => {
				regenerate();
			});
	}

	useEffect(() => {
		_refresh();
	}, []);

	function toggleSelect(id: number) {
		const match = Data.find((o) => o.id === id);
		if (!match) return;

		if (match.selected) {
			AccountDbService.deselect(match.id as unknown as number).finally(() => {
				_refresh();
			});
		} else {
			AccountDbService.select(match.id as unknown as number).then(() => {
				_refresh();
			});
			// FIXME: fix this
			// await EmojiService.refresh(db, globalDb, acct.server, true);
		}
	}

	/**
	 * Clear all known keys used for exchanging raw objects
	 * between components
	 */
	function remove(id: number) {
		AccountDbService.remove(id).finally(() => {
			console.log('[INFO]: deleted acct');
			_refresh();
		});
	}

	return (
		<AccountDbContext.Provider value={{ accounts: Data, toggleSelect, remove }}>
			{children}
		</AccountDbContext.Provider>
	);
}

export default WithAccountDbContext;
