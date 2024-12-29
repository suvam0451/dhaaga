import { createContext, useContext, useEffect, useReducer } from 'react';
import {
	PostComposerDispatchType,
	postComposerReducer as reducer,
	PostComposerReducerActionType,
	postComposerReducerDefault as reducerDefault,
	PostComposerReducerStateType,
} from '../../../../../states/reducers/post-composer.reducer';
import { useAppBottomSheet_Improved } from '../../../../../hooks/utility/global-state-extractors';
import usePostComposeAutoCompletion from './usePostComposeAutoCompletion';

type Type = {
	state: PostComposerReducerStateType;
	dispatch: PostComposerDispatchType;
};

const defaultValue: Type = {
	state: null,
	dispatch: null,
};

const ComposerContext = createContext<Type>(defaultValue);

export function useComposerContext() {
	return useContext(ComposerContext);
}

type Props = {
	children: any;
	textSeed?: string;
};

function WithComposerContext({ children, textSeed }: Props) {
	const { stateId } = useAppBottomSheet_Improved();
	const [state, dispatch] = useReducer(reducer, reducerDefault);
	usePostComposeAutoCompletion(state, dispatch);

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
		<ComposerContext.Provider
			value={{
				state,
				dispatch,
			}}
		>
			{children}
		</ComposerContext.Provider>
	);
}

export default WithComposerContext;
