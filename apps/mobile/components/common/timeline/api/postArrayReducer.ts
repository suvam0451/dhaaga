import { produce } from 'immer';
import { Dispatch, MutableRefObject } from 'react';
import { StatusInterface } from '@dhaaga/bridge';
import { PostMiddleware } from '../../../../services/middlewares/post.middleware';
import { ActivityPubReactionStateDto } from '../../../../services/approto/activitypub-reactions.service';
import { AppPostObject } from '../../../../types/app-post.types';

export enum TIMELINE_POST_LIST_DATA_REDUCER_TYPE {
	CLEAR = 'clear',
	ADD = 'add',
	UPDATE_BOOST_STATUS = 'updateBoostStatus',
	UPDATE_TRANSLATION_OUTPUT = 'updateTranslationOutput',
	UPDATE_REACTION_STATE = 'updateReactionState',
}

export type TimelineDataReducerFunction = Dispatch<{
	type: TIMELINE_POST_LIST_DATA_REDUCER_TYPE;
	payload?: any;
}>;

/**
 * Perform mutable operations on a
 * list of posts in a timeline
 */
function postArrayReducer(
	state: AppPostObject[],
	action: {
		type: TIMELINE_POST_LIST_DATA_REDUCER_TYPE;
		payload?: any;
	},
): AppPostObject[] {
	switch (action.type as TIMELINE_POST_LIST_DATA_REDUCER_TYPE) {
		case TIMELINE_POST_LIST_DATA_REDUCER_TYPE.CLEAR: {
			return [];
		}
		case TIMELINE_POST_LIST_DATA_REDUCER_TYPE.ADD: {
			const _more: StatusInterface[] = action.payload.more;
			const _seen: MutableRefObject<Set<string>> = action.payload.seen;
			const _domain: string = action.payload.domain;
			const _subdomain: string = action.payload.subdomain;
			return produce(state, (draft) => {
				for (const item of _more) {
					if (!item) continue;
					const k = item.getId();
					if (_seen.current.has(k)) continue;
					_seen.current.add(k);
					draft.push(new PostMiddleware(item, _domain, _subdomain).export());
				}
			});
		}
		case TIMELINE_POST_LIST_DATA_REDUCER_TYPE.UPDATE_TRANSLATION_OUTPUT: {
			const _id = action.payload.id;
			const _outputText = action.payload.outputText;
			const _outputType = action.payload.outputType;
			if (
				_id === undefined ||
				_outputText === undefined ||
				_outputType === undefined
			)
				return state;

			return produce(state, (posts) => {
				for (const post of posts) {
					if (post.id === _id) {
						post.calculated.translationOutput = _outputText;
						post.calculated.translationType = _outputType;
					}
					if (post.boostedFrom?.id === _id) {
						post.boostedFrom.calculated.translationOutput = _outputText;
						post.boostedFrom.calculated.translationType = _outputType;
					}
				}
			});
		}
		case TIMELINE_POST_LIST_DATA_REDUCER_TYPE.UPDATE_REACTION_STATE: {
			const _id = action.payload.id;
			const _state = action.payload.state;
			const { data, error } = ActivityPubReactionStateDto.safeParse(_state);
			if (error) {
				console.log('[WARN]: reaction state incorrect', error);
				return state;
			}

			return produce(state, (posts) => {
				for (const post of posts) {
					if (post.id === _id) post.stats.reactions = data;
					if (post.boostedFrom?.id === _id)
						post.boostedFrom.stats.reactions = data;
				}
			});
		}
	}
}

export default postArrayReducer;
