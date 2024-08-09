import { createContext, useContext, useRef, useState } from 'react';
import useHookLoadingState from '../../../../states/useHookLoadingState';
import AppBottomSheet from '../../Core';
import {
	StatusInterface,
	UserInterface,
} from '@dhaaga/shared-abstraction-activitypub';

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

	// references
	PostRef: React.MutableRefObject<StatusInterface>;
	PostIdRef: React.MutableRefObject<string>;
	UserRef: React.MutableRefObject<UserInterface>;
	UserIdRef: React.MutableRefObject<string>;
};

const defaultValue: Type = {
	type: BOTTOM_SHEET_ENUM.NA,
	setType: () => {},
	visible: false,
	setVisible: () => {},
	updateRequestId: () => {},
	PostRef: undefined,
	PostIdRef: undefined,
	UserRef: undefined,
	UserIdRef: undefined,
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
	const { forceUpdate } = useHookLoadingState();

	// pointers
	const PostRef = useRef<StatusInterface>(null);
	const PostIdRef = useRef<string>(null);
	const UserRef = useRef<UserInterface>(null);
	const UserIdRef = useRef<string>(null);

	return (
		<AppBottomSheetContext.Provider
			value={{
				type: Type,
				setType,
				visible: Visible,
				setVisible,
				updateRequestId: forceUpdate,
				PostRef,
				PostIdRef,
				UserRef,
				UserIdRef,
			}}
		>
			{children}
			<AppBottomSheet />
		</AppBottomSheetContext.Provider>
	);
}

export default WithAppBottomSheetContext;
