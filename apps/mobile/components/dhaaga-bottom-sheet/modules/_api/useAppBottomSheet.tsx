import { createContext, useContext, useState } from 'react';
import useHookLoadingState from '../../../../states/useHookLoadingState';
import AppBottomSheet from '../../Core';

export enum BOTTOM_SHEET_ENUM {
	HASHTAG = 'Hashtag',
	LINK = 'Link',
	STATUS_COMPOSER = 'StatusComposer',
	STATUS_MENU = 'StatusMenu',
	STATUS_PREVIEW = 'StatusPreview',
	NA = 'N/A',
}

type Type = {
	type: BOTTOM_SHEET_ENUM;
	setType: (type: BOTTOM_SHEET_ENUM) => void;
	visible: boolean;
	setVisible: (visible: boolean) => void;
	updateRequestId: () => void;
};

const defaultValue: Type = {
	type: BOTTOM_SHEET_ENUM.NA,
	setType: () => {},
	visible: false,
	setVisible: () => {},
	updateRequestId: () => {},
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
	return (
		<AppBottomSheetContext.Provider
			value={{
				type: Type,
				setType,
				visible: Visible,
				setVisible,
				updateRequestId: forceUpdate,
			}}
		>
			{children}
			<AppBottomSheet />
		</AppBottomSheetContext.Provider>
	);
}

export default WithAppBottomSheetContext;
