import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useReducer,
	useState,
} from 'react';
import {
	PostComposerDispatchType,
	postComposerReducer as reducer,
	PostComposerReducerActionType,
	postComposerReducerDefault as reducerDefault,
	PostComposerReducerStateType,
} from '../../../../../states/reducers/post-composer.reducer';
import { useAppBottomSheet_Improved } from '../../../../../hooks/utility/global-state-extractors';
import usePostComposeAutoCompletion from './usePostComposeAutoCompletion';

export type ComposeMediaTargetItem = {
	previewUrl?: string;
	remoteId?: string;
	url?: string;
	uploaded: boolean;
	localUri: string;
	status?: string;
	cw?: string;
};

type Type = {
	state: PostComposerReducerStateType;
	dispatch: PostComposerDispatchType;
	setAltText: (index: number, o: string) => void;
	// media items to track upload for
	mediaTargets: ComposeMediaTargetItem[];
	addMediaTarget: ({}: {
		localUri: string;
		uploaded: boolean;
		remoteId: string;
		previewUrl?: string;
	}) => void;
	removeMediaTarget: (index: number) => void;
};

const defaultValue: Type = {
	state: null,
	dispatch: null,
	// media items to track upload for
	mediaTargets: [],
	addMediaTarget: () => {},
	removeMediaTarget: () => {},
	setAltText: () => {},
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

	/**
	 * Media Targets
	 */
	const [MediaTargets, setMediaTargets] = useState<ComposeMediaTargetItem[]>(
		[],
	);
	const addMediaTarget = useCallback(
		({
			localUri,
			uploaded,
			remoteId,
			previewUrl,
		}: {
			localUri: string;
			uploaded: boolean;
			remoteId: string;
			previewUrl?: string;
		}) => {
			setMediaTargets((o) =>
				o.concat([
					{
						localUri,
						uploaded: uploaded || false,
						remoteId,
						previewUrl,
					},
				]),
			);
		},
		[],
	);

	const removeMediaTarget = useCallback((index: number) => {
		setMediaTargets((o) => [...o.slice(0, index), ...o.slice(index + 1)]);
	}, []);

	function setAltText(index: number, text: string) {
		if (index >= MediaTargets.length) return;

		MediaTargets[index].cw = text;
		setMediaTargets(MediaTargets);
	}

	return (
		<ComposerContext.Provider
			value={{
				state,
				dispatch,
				setAltText,
				mediaTargets: MediaTargets,
				addMediaTarget,
				removeMediaTarget,
			}}
		>
			{children}
		</ComposerContext.Provider>
	);
}

export default WithComposerContext;
