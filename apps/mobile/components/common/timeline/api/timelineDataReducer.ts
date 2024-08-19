import { ActivityPubStatusAppDtoType } from '../../../../services/ap-proto/activitypub-status-dto.service';
import { produce } from 'immer';

export enum TIMELINE_DATA_REDUCER_TYPE {
	CLEAR = 'clear',
	APPEND = 'append',
	UPDATE_BOOKMARK_STATUS = 'updateBookmarkStatus',
	UPDATE_BOOST_STATUS = 'updateBoostStatus',
	UPDATE_TRANSLATION_OUTPUT = 'updateTranslationOutput',
}

function timelineDataReducer(
	state: ActivityPubStatusAppDtoType[],
	action: { type: TIMELINE_DATA_REDUCER_TYPE; payload?: any },
): ActivityPubStatusAppDtoType[] {
	switch (action.type as TIMELINE_DATA_REDUCER_TYPE) {
		case TIMELINE_DATA_REDUCER_TYPE.CLEAR: {
			return [];
		}
		case TIMELINE_DATA_REDUCER_TYPE.APPEND: {
			const _more = action.payload.data;
			return state.concat(_more);
		}
		case TIMELINE_DATA_REDUCER_TYPE.UPDATE_BOOKMARK_STATUS: {
			const _id: string = action.payload.id;
			const _value: boolean = action.payload.value;

			if (_id === undefined || _value === undefined) return state;
			return produce(state, (posts) => {
				for (const post of posts) {
					if (post.id === _id) {
						post.interaction.bookmarked = _value;
					}

					if (post.boostedFrom?.id === _id) {
						post.boostedFrom.interaction.bookmarked = _value;
					}
				}
			});
		}
		case TIMELINE_DATA_REDUCER_TYPE.UPDATE_BOOST_STATUS: {
			const _id: string = action.payload.id;
			const _value: boolean = action.payload.value;
			if (!_id || !_value) return state;
			return produce(state, (posts) => {
				for (const post of posts) {
					if (post.id === _id) {
						post.interaction.boosted = _value;
					}

					if (post.boostedFrom?.id === _id) {
						post.boostedFrom.interaction.boosted = _value;
					}
				}
			});
		}
		case TIMELINE_DATA_REDUCER_TYPE.UPDATE_TRANSLATION_OUTPUT: {
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
	}
}

export default timelineDataReducer;
