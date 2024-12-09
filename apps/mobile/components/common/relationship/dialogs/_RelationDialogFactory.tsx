import { memo } from 'react';
import { RelationshipDialogProps } from '../fragments/_common';
import { Dialog } from '@rneui/themed';
import { useAppTheme } from '../../../../hooks/app/useAppThemePack';
import { StyleSheet, Text } from 'react-native';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { APP_FONT } from '../../../../styles/AppTheme';

const RelationDialogFactory = memo(
	({
		visible,
		setVisible,
		children,
		label,
	}: RelationshipDialogProps & { children: any; label: string }) => {
		const { colorScheme } = useAppTheme();
		return (
			<Dialog
				overlayStyle={{ backgroundColor: colorScheme.palette.menubar }}
				isVisible={visible}
				onBackdropPress={() => {
					setVisible(false);
				}}
			>
				<Text
					style={[styles.modalTitle, { color: colorScheme.textColor.high }]}
				>
					{label}
				</Text>
				{children}
			</Dialog>
		);
	},
);

export default RelationDialogFactory;

const styles = StyleSheet.create({
	modalTitle: {
		fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
		textAlign: 'center',
		color: APP_FONT.MONTSERRAT_BODY,
		fontSize: 18,
		marginBottom: 16,
	},
	modalDescription: {
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
		textAlign: 'center',
		color: APP_FONT.MONTSERRAT_BODY,
		fontSize: 14,
	},
	actionButtonContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		marginVertical: 16,
	},
});
