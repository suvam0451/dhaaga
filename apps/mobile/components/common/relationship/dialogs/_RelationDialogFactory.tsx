import { memo } from 'react';
import { RelationshipDialogProps } from '../fragments/_common';
import { Dialog } from '@rneui/themed';

const RelationDialogFactory = memo(
	({
		visible,
		setVisible,
		children,
	}: RelationshipDialogProps & { children: any }) => {
		return (
			<Dialog
				overlayStyle={{ backgroundColor: '#2c2c2c' }}
				isVisible={visible}
				onBackdropPress={() => {
					setVisible(false);
				}}
			>
				{children}
			</Dialog>
		);
	},
);

export default RelationDialogFactory;
