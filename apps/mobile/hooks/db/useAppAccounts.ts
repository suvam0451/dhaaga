import { useEffect, useState } from 'react';
import { AccountService } from '../../database/entities/account';
import useGlobalState from '../../states/_global';
import { useShallow } from 'zustand/react/shallow';

function useAppAccounts(stateId?: string) {
	const { db } = useGlobalState(
		useShallow((o) => ({
			db: o.db,
		})),
	);

	const [Accounts, setAccounts] = useState([]);

	useEffect(() => {
		const getResult = AccountService.getAll(db);
		if (getResult.type === 'success') {
			setAccounts(getResult.value);
		} else {
			setAccounts([]);
		}
	}, [stateId]);

	return { accounts: Accounts };
}

export { useAppAccounts };
