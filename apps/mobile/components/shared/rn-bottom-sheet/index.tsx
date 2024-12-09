import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useEffect, useRef } from 'react';
import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { View } from 'react-native';

function BottomSheet_PostActions() {
	return <View></View>;
}

function AppReactNativeBottomSheetContent() {
	const { type } = useGlobalState(
		useShallow((o) => ({
			type: o.rnBottomSheet.type,
		})),
	);

	switch (type) {
		case 'N/A':
			return <View />;
		case 'PostMenu':
			return <BottomSheet_PostActions />;
	}
}

function AppReactNativeBottomSheet() {
	const ref = useRef<BottomSheetModal>(null);
	const { visible } = useGlobalState(
		useShallow((o) => ({
			visible: o.rnBottomSheet.visible,
		})),
	);

	useEffect(() => {
		if (visible) {
			ref.current?.present();
		} else {
			ref.current?.dismiss();
		}
	}, [visible]);

	return (
		<BottomSheetModal ref={ref}>
			<BottomSheetView>
				<AppReactNativeBottomSheetContent />
			</BottomSheetView>
		</BottomSheetModal>
	);
}

export default AppReactNativeBottomSheet;
