import { useEffect } from 'react';
import useSuggestionsApi from './useSuggestionsApi';
import {
	PostComposerStateType,
	PostComposerDispatchType,
	PostComposerAction,
} from '@dhaaga/react';

/**
 * Just import this hook to add
 * autocompletion for any composer
 * @param state
 * @param dispatch
 */
function useAutoSuggestion(
	state: PostComposerStateType,
	dispatch: PostComposerDispatchType,
) {
	const { status, data, error, fetchStatus } = useSuggestionsApi(state.prompt);

	useEffect(() => {
		if (fetchStatus === 'fetching') return;
		if (status !== 'success') {
			dispatch({ type: PostComposerAction.CLEAR_SUGGESTION });
			return;
		}
		dispatch({
			type: PostComposerAction.SET_SUGGESTION,
			payload: data,
		});
	}, [fetchStatus, data]);
}

export default useAutoSuggestion;
