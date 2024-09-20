import { Accounts } from '../../../../../../database/entities/account';

export type AppAccountListState = {
	accounts: Accounts[];
};

export enum APP_ACCOUNT_LIST_DATA_REDUCER_TYPE {
	INIT = 'init',
	SELECT = 'select',
	UPDATE = 'update',
	DELETE = 'delete',
	DESELECT = 'deselect',
}

function accountListReducer(
	state: AppAccountListState,
	action: { type: APP_ACCOUNT_LIST_DATA_REDUCER_TYPE; payload?: any },
) {
	switch (action.type as APP_ACCOUNT_LIST_DATA_REDUCER_TYPE) {
		case APP_ACCOUNT_LIST_DATA_REDUCER_TYPE.INIT: {
			const accounts = action.payload.accounts;
			return { accounts };
		}
	}
}

export default accountListReducer;
