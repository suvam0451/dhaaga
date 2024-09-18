import { produce } from 'immer';
import { Dispatch, MutableRefObject } from 'react';
import { StatusInterface } from '@dhaaga/shared-abstraction-activitypub';
import { ActivityPubStatusAppDtoType } from '../../../../services/approto/app-status-dto.service';
import { ActivitypubStatusService } from '../../../../services/approto/activitypub-status.service';
import { ActivityPubReactionStateDto } from '../../../../services/approto/activitypub-reactions.service';

export enum TIMELINE_POST_LIST_DATA_REDUCER_TYPE {
	CLEAR = 'clear',
	ADD = 'add',
	UPDATE_BOOKMARK_STATUS = 'updateBookmarkStatus',
	UPDATE_BOOST_STATUS = 'updateBoostStatus',
	UPDATE_TRANSLATION_OUTPUT = 'updateTranslationOutput',
	UPDATE_LIKE_STATUS = 'updateLikeStatus',
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
	state: ActivityPubStatusAppDtoType[],
	action: { type: TIMELINE_POST_LIST_DATA_REDUCER_TYPE; payload?: any },
): ActivityPubStatusAppDtoType[] {
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
					const k = item.getId();
					if (_seen.current.has(k)) continue;
					_seen.current.add(k);
					draft.push(
						new ActivitypubStatusService(item, _domain, _subdomain).export(),
					);
				}
			});
		}
		case TIMELINE_POST_LIST_DATA_REDUCER_TYPE.UPDATE_BOOKMARK_STATUS: {
			const _id: string = action.payload.id;
			const _value: boolean = action.payload.value;

			if (_id === undefined || _value === undefined) return state;
			return produce(state, (posts) => {
				for (const post of posts) {
					if (post.id === _id) {
						post.interaction.bookmarked = _value;
						post.state.isBookmarkStateFinal = true;
					}

					if (post.boostedFrom?.id === _id) {
						post.boostedFrom.interaction.bookmarked = _value;
						post.boostedFrom.state.isBookmarkStateFinal = true;
					}
				}
			});
		}
		case TIMELINE_POST_LIST_DATA_REDUCER_TYPE.UPDATE_BOOST_STATUS: {
			const _id: string = action.payload.id;
			const _value = action.payload.value;
			if (!_id || !_value) return state;
			return produce(state, (posts) => {
				for (const post of posts) {
					if (post.id === _id) {
						post.interaction.boosted = _value != -1;
						post.stats.boostCount += parseInt(_value);
					}

					if (post.boostedFrom?.id === _id) {
						post.boostedFrom.interaction.boosted = _value != -1;
						post.stats.boostCount += parseInt(_value);
					}
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
		case TIMELINE_POST_LIST_DATA_REDUCER_TYPE.UPDATE_LIKE_STATUS: {
			const _id = action.payload.id;
			const _delta = action.payload.delta;

			if (_id === undefined || _delta === undefined) return state;
			return produce(state, (posts) => {
				for (const post of posts) {
					if (post.id === _id) {
						post.interaction.liked = _delta != -1;
						post.stats.likeCount += parseInt(_delta);
					}
					if (post.boostedFrom?.id === _id) {
						post.boostedFrom.interaction.liked = _delta != -1;
						post.boostedFrom.stats.likeCount += parseInt(_delta);
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
