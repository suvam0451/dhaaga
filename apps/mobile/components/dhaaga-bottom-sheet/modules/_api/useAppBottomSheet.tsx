import {
	createContext,
	Dispatch,
	MutableRefObject,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import useHookLoadingState from '../../../../states/useHookLoadingState';
import AppBottomSheet from '../../Core';
import { UserInterface } from '@dhaaga/shared-abstraction-activitypub';
import {
	TIMELINE_POST_LIST_DATA_REDUCER_TYPE,
	TimelineDataReducerFunction,
} from '../../../common/timeline/api/postArrayReducer';
import { ActivityPubStatusAppDtoType_DEPRECATED } from '../../../../services/app-status-dto.service';
import { APP_BOTTOM_SHEET_ENUM } from '../../../../states/_global';

type Type = {
	type: APP_BOTTOM_SHEET_ENUM;
	setType: (type: APP_BOTTOM_SHEET_ENUM) => void;
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
	ParentRef: MutableRefObject<ActivityPubStatusAppDtoType_DEPRECATED>;
	RootRef: MutableRefObject<ActivityPubStatusAppDtoType_DEPRECATED>;
	TextRef: MutableRefObject<string>;
	PostRef: MutableRefObject<ActivityPubStatusAppDtoType_DEPRECATED>;
	PostIdRef: MutableRefObject<string>;
	UserRef: MutableRefObject<UserInterface>;
	UserIdRef: MutableRefObject<string>;
	// pre-populate the post-composer to this content
	PostComposerTextSeedRef: MutableRefObject<string>;

	// reducers
	timelineDataPostListReducer: MutableRefObject<TimelineDataReducerFunction>;
};

const defaultValue: Type = {
	type: APP_BOTTOM_SHEET_ENUM.NA,
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
	timelineDataPostListReducer: undefined,
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
	const [Type, setType] = useState(APP_BOTTOM_SHEET_ENUM.NA);
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
	const PostRef = useRef<ActivityPubStatusAppDtoType_DEPRECATED>(null);
	const PostIdRef = useRef<string>(null);
	const UserRef = useRef<UserInterface>(null);
	const UserIdRef = useRef<string>(null);
	const PostComposerTextSeedRef = useRef<string>(null);
	const ParentRef = useRef<ActivityPubStatusAppDtoType_DEPRECATED>(null);
	const RootRef = useRef<ActivityPubStatusAppDtoType_DEPRECATED>(null);

	// reducers
	const timelineDataPostListReducer = useRef<
		Dispatch<{
			type: TIMELINE_POST_LIST_DATA_REDUCER_TYPE;
			payload?: any;
		}>
	>(null);

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
				timelineDataPostListReducer,
				isAnimating: IsAnimating,
			}}
		>
			{children}
			<AppBottomSheet />
		</AppBottomSheetContext.Provider>
	);
}

export default WithAppBottomSheetContext;
