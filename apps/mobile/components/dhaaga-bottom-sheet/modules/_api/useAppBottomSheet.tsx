import {
	createContext,
	MutableRefObject,
	useContext,
	useRef,
	useState,
} from 'react';
import useHookLoadingState from '../../../../states/useHookLoadingState';
import AppBottomSheet from '../../Core';
import { UserInterface } from '@dhaaga/shared-abstraction-activitypub';
import { ActivityPubStatusAppDtoType } from '../../../../services/ap-proto/activitypub-status-dto.service';

export enum BOTTOM_SHEET_ENUM {
	HASHTAG = 'Hashtag',
	LINK = 'Link',
	STATUS_COMPOSER = 'StatusComposer',
	STATUS_MENU = 'StatusMenu',
	STATUS_PREVIEW = 'StatusPreview',
	PROFILE_PEEK = 'ProfilePeek',
	NA = 'N/A',
}

type Type = {
	type: BOTTOM_SHEET_ENUM;
	setType: (type: BOTTOM_SHEET_ENUM) => void;
	visible: boolean;
	setVisible: (visible: boolean) => void;
	updateRequestId: () => void;
	requestId: string;
	replyToRef?: MutableRefObject<ActivityPubStatusAppDtoType>;

	// references
	PostRef: MutableRefObject<ActivityPubStatusAppDtoType>;
	PostIdRef: MutableRefObject<string>;
	UserRef: MutableRefObject<UserInterface>;
	UserIdRef: MutableRefObject<string>;
	// pre-populate the post-composer to this content
	PostComposerTextSeedRef: MutableRefObject<string>;
};

const defaultValue: Type = {
	type: BOTTOM_SHEET_ENUM.NA,
	replyToRef: undefined,
	setType: () => {},
	visible: false,
	setVisible: () => {},
	updateRequestId: () => {},
	requestId: '',
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
	const [Type, setType] = useState(BOTTOM_SHEET_ENUM.NA);
	const { forceUpdate, State } = useHookLoadingState();

	// pointers
	const PostRef = useRef<ActivityPubStatusAppDtoType>(null);
	const PostIdRef = useRef<string>(null);
	const UserRef = useRef<UserInterface>(null);
	const UserIdRef = useRef<string>(null);
	const PostComposerTextSeedRef = useRef<string>(null);
	const replyToRef = useRef<ActivityPubStatusAppDtoType>(null);

	return (
		<AppBottomSheetContext.Provider
			value={{
				type: Type,
				setType,
				visible: Visible,
				setVisible,
				updateRequestId: forceUpdate,
				requestId: State,
				PostRef,
				PostIdRef,
				UserRef,
				UserIdRef,
				PostComposerTextSeedRef,
				replyToRef,
			}}
		>
			{children}
			<AppBottomSheet />
		</AppBottomSheetContext.Provider>
	);
}

export default WithAppBottomSheetContext;
