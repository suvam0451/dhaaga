import {
	createContext,
	MutableRefObject,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import useHookLoadingState from '../../../../states/useHookLoadingState';
import AppBottomSheet from '../../Core';
import { UserInterface } from '@dhaaga/bridge';
import { AppPostObject } from '../../../../types/app-post.types';

type Type = {
	type: any;
	setType: (type: any) => void;
	visible: boolean;
	setVisible: (visible: boolean) => void;
	updateRequestId: () => void;
	requestId: string;

	/**
	 * to prevent lists from being
	 * rendered while the bottom
	 * sheet animation is playing out
	 * */
	isAnimating: boolean;

	// references
	HandleRef: MutableRefObject<string>;
	ParentRef: MutableRefObject<AppPostObject>;
	RootRef: MutableRefObject<AppPostObject>;
	TextRef: MutableRefObject<string>;
	PostRef: MutableRefObject<AppPostObject>;
	PostIdRef: MutableRefObject<string>;
	UserRef: MutableRefObject<UserInterface>;
	UserIdRef: MutableRefObject<string>;
	// pre-populate the post-composer to this content
	PostComposerTextSeedRef: MutableRefObject<string>;
};

const defaultValue: Type = {
	type: null,
	setType: () => {},

	isAnimating: false,
	visible: false,
	setVisible: () => {},
	updateRequestId: () => {},
	requestId: '',
	HandleRef: undefined,
	ParentRef: undefined,
	RootRef: undefined,
	TextRef: undefined,
	PostRef: undefined,
	PostIdRef: undefined,
	UserRef: undefined,
	UserIdRef: undefined,
	PostComposerTextSeedRef: undefined,
};

const AppBottomSheetContext = createContext<Type>(defaultValue);

export function useAppBottomSheet() {
	return useContext(AppBottomSheetContext);
}

type Props = {
	children: any;
};

function WithAppBottomSheetContext({ children }: Props) {
	const [Visible, setVisible] = useState(false);
	const [Type, setType] = useState(null);
	const { forceUpdate, State } = useHookLoadingState();
	const [IsAnimating, setIsAnimating] = useState(false);

	useEffect(() => {
		if (!Visible) {
			setIsAnimating(true);
		} else {
			setIsAnimating(true);
			setTimeout(() => {
				setIsAnimating(false);
			}, 480);
		}
	}, [Visible]);

	// pointers
	const HandleRef = useRef<string>(null);
	const TextRef = useRef<string>(null);
	const PostRef = useRef<AppPostObject>(null);
	const PostIdRef = useRef<string>(null);
	const UserRef = useRef<UserInterface>(null);
	const UserIdRef = useRef<string>(null);
	const PostComposerTextSeedRef = useRef<string>(null);
	const ParentRef = useRef<AppPostObject>(null);
	const RootRef = useRef<AppPostObject>(null);

	return (
		<AppBottomSheetContext.Provider
			value={{
				type: Type,
				setType,
				visible: Visible,
				setVisible,
				updateRequestId: forceUpdate,
				requestId: State,
				HandleRef,
				TextRef,
				PostRef,
				PostIdRef,
				UserRef,
				UserIdRef,
				PostComposerTextSeedRef,
				ParentRef,
				RootRef,
				isAnimating: IsAnimating,
			}}
		>
			{children}
			<AppBottomSheet />
		</AppBottomSheetContext.Provider>
	);
}

export default WithAppBottomSheetContext;
