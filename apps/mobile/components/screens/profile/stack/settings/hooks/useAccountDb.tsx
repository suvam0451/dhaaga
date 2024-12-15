import { createContext, useContext, useEffect, useState } from 'react';
import { Account } from '../../../../../../database/_schema';
import { AccountService } from '../../../../../../database/entities/account';
import useGlobalState from '../../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

type Type = {
	accounts: Account[];
	remove: (id: number) => void;
};

const defaultValue: Type = {
	accounts: [],
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
	const { db } = useGlobalState(
		useShallow((o) => ({
			db: o.db,
		})),
	);
	const [Data, setData] = useState<Account[]>([]);

	function refresh() {
		console.log('refresh attempt');
		const getResult = AccountService.getAll(db);
		if (getResult.type === 'success') {
			setData(getResult.value);
		} else {
			setData([]);
		}
	}

	useEffect(() => {
		refresh();
	}, [db]);

	function remove(id: number) {
		AccountService.removeById(db, id).finally(() => {
			refresh();
		});
	}

	return (
		<AccountDbContext.Provider value={{ accounts: Data, remove }}>
			{children}
		</AccountDbContext.Provider>
	);
}

export default WithAccountDbContext;
