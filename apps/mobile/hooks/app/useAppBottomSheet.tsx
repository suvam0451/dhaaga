import { createContext, useContext, useState } from 'react';
import useHookLoadingState from '../../states/useHookLoadingState';
import AppBottomSheet from '../../components/dhaaga-bottom-sheet/Core';

export enum BOTTOM_SHEET_ENUM {
	HASHTAG = 'Hashtag',
	LINK = 'Link',
	STATUS_COMPOSER = 'StatusComposer',
	STATUS_MENU = 'StatusMenu',
	NA = 'N/A',
}

type Type = {
	setType: (type: BOTTOM_SHEET_ENUM) => void;
	visible: boolean;
	setVisible: (visible: boolean) => void;
	updateRequestId: () => void;
};

const defaultValue: Type = {
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
				visible: Visible,
				setVisible,
				setType,
				updateRequestId: forceUpdate,
			}}
		>
			{children}
			<AppBottomSheet />
		</AppBottomSheetContext.Provider>
	);
}

export default WithAppBottomSheetContext;
