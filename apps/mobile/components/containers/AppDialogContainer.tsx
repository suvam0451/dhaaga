import { RneuiDialogProps } from '../dialogs/_types';
import { Dialog } from '@rneui/themed';

function AppDialogContainer({
	IsVisible,
	setIsVisible,
	children,
}: RneuiDialogProps & { children: any }) {
	return (
		<Dialog
			isVisible={IsVisible}
			onBackdropPress={() => {
				setIsVisible(false);
			}}
			style={{
				backgroundColor: '#121212',
			}}
			overlayStyle={{ backgroundColor: '#1c1c1c', borderRadius: 8 }}
		>
			{children}
		</Dialog>
	);
}

export default AppDialogContainer;
