import { useEffect } from 'react';
import {
	PostComposerDispatchType,
	PostComposerReducerActionType,
	PostComposerReducerStateType,
} from '../../../states/interactors/post-composer.reducer';
import useSuggestionsApi from './useSuggestionsApi';

/**
 * Just import this hook to add
 * autocompletion for any composer
 * @param state
 * @param dispatch
 */
function useAutoSuggestion(
	state: PostComposerReducerStateType,
	dispatch: PostComposerDispatchType,
) {
	const { status, data, error, fetchStatus } = useSuggestionsApi(state.prompt);

	useEffect(() => {
		if (fetchStatus === 'fetching') return;
		if (status !== 'success') {
			dispatch({ type: PostComposerReducerActionType.CLEAR_SUGGESTION });
			console.log(error);
			return;
		}
		dispatch({
			type: PostComposerReducerActionType.SET_SUGGESTION,
			payload: data,
		});
	}, [fetchStatus, data]);
}

export default useAutoSuggestion;
