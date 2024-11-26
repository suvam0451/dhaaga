import { createContext, useContext, useEffect, useState } from 'react';
import { useActivityPubRestClientContext } from '../../../../../../states/useActivityPubRestClient';
import { useSQLiteContext } from 'expo-sqlite';
import { Account } from '../../../../../../database/_schema';
import { AccountService } from '../../../../../../database/entities/account';

type Type = {
	accounts: Account[];
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

function WithAccountDbContext({ children }: Props) {
	const { regenerate } = useActivityPubRestClientContext();
	const db = useSQLiteContext();
	const [Data, setData] = useState<Account[]>([]);

	function refresh() {
		AccountService.getAll(db).then((res) => {
			if (res.type === 'success') setData(res.value);
			setData([]);
		});
	}

	useEffect(() => {
		refresh();
	}, [db]);

	function toggleSelection(id: number) {
		const match = Data.find((o) => o.id === id);
		if (!match) return;

		if (match.selected) {
			AccountService.deselect(db, match).finally(() => {
				refresh();
			});
		} else {
			AccountService.select(db, match).finally(() => {
				refresh();
			});
			// FIXME: fix this
			// await EmojiService.refresh(db, globalDb, acct.server, true);
		}
	}

	function remove(id: number) {
		AccountService.removeById(db, id).finally(() => {
			refresh();
		});
	}

	return (
		<AccountDbContext.Provider
			value={{ accounts: Data, toggleSelect: toggleSelection, remove }}
		>
			{children}
		</AccountDbContext.Provider>
	);
}

export default WithAccountDbContext;
