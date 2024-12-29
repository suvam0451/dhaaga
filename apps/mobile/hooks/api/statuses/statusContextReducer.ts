import MastodonService from '../../../services/mastodon.service';
import { produce } from 'immer';
import {
	KNOWN_SOFTWARE,
	StatusInterface,
} from '@dhaaga/shared-abstraction-activitypub';
import { PostMiddleware } from '../../../services/middlewares/post.middleware';
import { AppBskyFeedGetPostThread } from '@atproto/api';
import AtprotoContextService from '../../../services/atproto/atproto-context-service';
import { AppPostObject } from '../../../types/app-post.types';

export enum STATUS_CONTEXT_REDUCER_ACTION {
	INIT = 'init',
	INIT_ATPROTO = 'initAtproto',
}

export type AppStatusContext = {
	entrypoint: string | null;
	lookup: Map<string, AppPostObject>;
	children: Map<string, string[]>;
	root: string | null;
};

export const defaultAppStatusContext: AppStatusContext = {
	entrypoint: null,
	lookup: new Map(),
	children: new Map(),
	root: null,
};

type ActionType =
	| {
			type: STATUS_CONTEXT_REDUCER_ACTION.INIT;
			payload: {
				source: StatusInterface;
				ancestors: StatusInterface[];
				descendants: StatusInterface[];
				driver: KNOWN_SOFTWARE;
				server: string;
			};
	  }
	| {
			type: STATUS_CONTEXT_REDUCER_ACTION.INIT_ATPROTO;
			payload: any;
	  };

function statusContextReducer(
	state: AppStatusContext,
	action: ActionType,
): AppStatusContext {
	switch (action.type) {
		case STATUS_CONTEXT_REDUCER_ACTION.INIT: {
			const _source = action.payload.source;
			const _ancestors = action.payload.ancestors;
			const _descendants = action.payload.descendants;
			const _driver: KNOWN_SOFTWARE = action.payload.driver;
			const _server = action.payload.server;

			if (
				_source === undefined ||
				_ancestors === undefined ||
				_descendants === undefined ||
				!_driver ||
				!_server
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
						new PostMiddleware(value, _driver, _server).export(),
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
		case STATUS_CONTEXT_REDUCER_ACTION.INIT_ATPROTO: {
			const resp: AppBskyFeedGetPostThread.Response = action.payload.resp;
			const _domain = action.payload.domain;
			const _subdomain = action.payload.subdomain;

			const { root, target, itemLookup, childrenLookup } =
				AtprotoContextService.solve(resp);

			return produce(state, (draft) => {
				draft.lookup.clear();
				draft.children.clear();

				draft.entrypoint = target.getId();
				draft.root = root.getId();

				// @ts-ignore-next-line
				for (let [key, value] of itemLookup) {
					draft.lookup.set(
						key,
						new PostMiddleware(value, _domain, _subdomain).export(),
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
