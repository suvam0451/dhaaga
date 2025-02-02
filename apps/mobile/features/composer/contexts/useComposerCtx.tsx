import { createContext, useContext, useEffect, useReducer } from 'react';
import {
	PostComposerDispatchType,
	postComposerReducer as reducer,
	PostComposerReducerActionType,
	postComposerReducerDefault as reducerDefault,
	PostComposerReducerStateType,
} from '../../../states/interactors/post-composer.reducer';
import { useAppBottomSheet } from '../../../hooks/utility/global-state-extractors';
import useAutoSuggestion from '../interactors/useAutoSuggestion';

type Type = {
	state: PostComposerReducerStateType;
	dispatch: PostComposerDispatchType;
};

const defaultValue: Type = {
	state: null,
	dispatch: null,
};

const ComposerCtx = createContext<Type>(defaultValue);

export function useComposerCtx() {
	return useContext(ComposerCtx);
}

type Props = {
	children: any;
	textSeed?: string;
};

function WithComposerContext({ children, textSeed }: Props) {
	const { stateId } = useAppBottomSheet();
	const [state, dispatch] = useReducer(reducer, reducerDefault);
	useAutoSuggestion(state, dispatch);

	// reset content on request
	useEffect(() => {
		dispatch({
			type: PostComposerReducerActionType.SET_TEXT,
			payload: {
				content: textSeed,
			},
		});
	}, [textSeed, stateId]);

	return (
		<ComposerCtx.Provider
			value={{
				state,
				dispatch,
			}}
		>
			{children}
		</ComposerCtx.Provider>
	);
}

export default WithComposerContext;
