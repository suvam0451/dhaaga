import { useAppBottomSheet } from '#/states/global/hooks';
import { useEffect, useRef } from 'react';
import { TextInput } from 'react-native';

function useAutoFocusBottomSheetInput(enabled: boolean) {
	const { visible, stateId } = useAppBottomSheet();
	const TextInputRef = useRef<TextInput>(null);

	useEffect(() => {
		const id = setTimeout(() => {
			if (visible && enabled) {
				TextInputRef?.current?.focus();
			}
		}, 200);
		return () => clearTimeout(id);
	}, [stateId]);

	return {
		ref: TextInputRef,
	};
}

export default useAutoFocusBottomSheetInput;
