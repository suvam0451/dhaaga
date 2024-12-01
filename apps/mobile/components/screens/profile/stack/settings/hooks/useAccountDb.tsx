import { createContext, useContext, useEffect, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
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
	const { selectAccount } = useGlobalState(
		useShallow((state) => ({
			selectAccount: state.selectAccount,
		})),
	);
	const db = useSQLiteContext();
	const [Data, setData] = useState<Account[]>([]);

	function refresh() {
		AccountService.getAll(db).then((res) => {
			if (res.type === 'success') {
				setData(res.value);
			} else {
				setData([]);
			}
		});
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
