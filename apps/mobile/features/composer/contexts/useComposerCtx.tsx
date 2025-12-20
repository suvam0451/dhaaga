import { createContext, useContext, useReducer } from 'react';
import {
	PostComposerDispatchType,
	postComposerReducer as reducer,
	postComposerReducerDefault as reducerDefault,
	PostComposerReducerStateType,
} from '../reducers/composer.reducer';
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
