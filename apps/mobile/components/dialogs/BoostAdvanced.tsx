import { Dialog, Text } from '@rneui/themed';
import { RneuiDialogProps } from './_types';

function BoostAdvanced({ IsVisible, setIsVisible }: RneuiDialogProps) {
	return (
		<Dialog
			style={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				marginRight: 12,
				paddingTop: 8,
				paddingBottom: 8,
				position: 'relative',
				backgroundColor: 'red',
			}}
			overlayStyle={{ backgroundColor: '#1c1c1c' }}
			isVisible={IsVisible}
			onBackdropPress={() => {
				setIsVisible(false);
			}}
		>
			<Text>Hey</Text>
		</Dialog>
	);
}

export default BoostAdvanced;
