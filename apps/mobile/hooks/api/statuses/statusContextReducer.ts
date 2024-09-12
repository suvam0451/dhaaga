import MastodonService from '../../../services/mastodon.service';
import { produce } from 'immer';
import { StatusInterface } from '@dhaaga/shared-abstraction-activitypub';
import { ActivitypubStatusService } from '../../../services/approto/activitypub-status.service';
import { ActivityPubStatusAppDtoType } from '../../../services/approto/activitypub-status-dto.service';

export enum STATUS_CONTEXT_REDUCER_ACTION {
	INIT = 'init',
}

export type AppStatusContext = {
	entrypoint: string | null;
	lookup: Map<string, ActivityPubStatusAppDtoType>;
	children: Map<string, string[]>;
	root: string | null;
};

export const defaultAppStatusContext: AppStatusContext = {
	entrypoint: null,
	lookup: new Map(),
	children: new Map(),
	root: null,
};

function statusContextReducer(
	state: AppStatusContext,
	action: {
		type: STATUS_CONTEXT_REDUCER_ACTION;
		payload: any;
	},
): AppStatusContext {
	console.log(action);
	switch (action.type as STATUS_CONTEXT_REDUCER_ACTION) {
		case STATUS_CONTEXT_REDUCER_ACTION.INIT: {
			const _source = action.payload.source;
			const _ancestors = action.payload.ancestors;
			const _descendants = action.payload.descendants;
			const _domain = action.payload.domain;
			const _subdomain = action.payload.subdomain;

			if (
				_source === undefined ||
				_ancestors === undefined ||
				_descendants === undefined ||
				!_domain ||
				!_subdomain
			) {
				return state;
			}

			const { root, itemLookup, childrenLookup } = MastodonService.solveContext(
				_source,
				[..._ancestors, ..._descendants],
			);
			return produce(state, (draft) => {
				draft.lookup.clear();
				draft.children.clear();

				draft.entrypoint = _source.getId();
				draft.root = root.getId();

				// @ts-ignore-next-line
				for (let [key, value] of itemLookup) {
					draft.lookup.set(
						key,
						new ActivitypubStatusService(value, _domain, _subdomain).export(),
					);
				}

				// @ts-ignore-next-line
				for (let [key, value] of childrenLookup) {
					draft.children.set(
						key,
						value.map((o: StatusInterface) => o.getId()),
					);
				}
			});
		}
	}
}

export default statusContextReducer;
