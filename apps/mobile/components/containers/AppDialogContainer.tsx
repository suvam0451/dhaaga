import { RneuiDialogProps } from '../dialogs/_types';
import { Dialog } from '@rneui/themed';
import { appVerticalIndex } from '../../styles/dimensions';
import { useAppTheme } from '../../hooks/utility/global-state-extractors';

function AppDialogContainer({
	IsVisible,
	setIsVisible,
	children,
}: RneuiDialogProps & { children: any }) {
	const { theme } = useAppTheme();
	return (
		<Dialog
			isVisible={IsVisible}
			onBackdropPress={() => {
				setIsVisible(false);
			}}
			style={{
				backgroundColor: theme.background.a20,
			}}
			overlayStyle={{
				backgroundColor: 'black',
				borderRadius: 8,
				zIndex: appVerticalIndex.dialogBackdrop,
			}}
		>
			{children}
		</Dialog>
	);
}

export default AppDialogContainer;
