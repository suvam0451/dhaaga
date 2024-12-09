import { UserInterface } from '@dhaaga/shared-abstraction-activitypub';
import { MutableRefObject } from 'react';
import { produce } from 'immer';
import AppUserService from '../../../../services/approto/app-user-service';

export enum TIMELINE_USER_LIST_DATA_REDUCER_TYPE {
	CLEAR = 'clear',
	ADD = 'add',
}

type Foo = AppUserService[];

function userArrayReducer(
	state: Foo,
	action: {
		type: TIMELINE_USER_LIST_DATA_REDUCER_TYPE;
		payload?: any;
	},
): Foo {
	switch (action.type as TIMELINE_USER_LIST_DATA_REDUCER_TYPE) {
		case TIMELINE_USER_LIST_DATA_REDUCER_TYPE.CLEAR: {
			return [];
		}
		case TIMELINE_USER_LIST_DATA_REDUCER_TYPE.ADD: {
			const _more: UserInterface[] = action.payload.more;
			const _seen: MutableRefObject<Set<string>> = action.payload.seen;
			const _domain: string = action.payload.domain;
			const _subdomain: string = action.payload.subdomain;

			return produce(state, (draft) => {
				for (const item of _more) {
					const k = item.getId();

					if (_seen.current.has(k)) continue;
					_seen.current.add(k);

					const res = AppUserService.export(item, _domain, _subdomain);
					if (res) draft.push(res);
				}
			});
		}
	}
}

export default userArrayReducer;
