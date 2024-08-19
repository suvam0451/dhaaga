import { Dispatch, SetStateAction } from 'react';
import { StyleSheet } from 'react-native';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { APP_FONT } from '../../../../styles/AppTheme';

export type RelationshipButtonProps = {
	loading: boolean;
	onPress: () => void;
};

export type RelationshipDialogProps = {
	visible: boolean;
	setVisible: Dispatch<SetStateAction<boolean>>;
	loading: boolean;
};

export const styles = StyleSheet.create({
	button: {
		borderColor: '#cb6483',
		backgroundColor: '#363636',
		borderRadius: 4,
		paddingVertical: 8,
		paddingHorizontal: 12,
	},
	buttonContainer: {
		borderRadius: 8,
	},
	text: {
		fontFamily: APP_FONTS.INTER_700_BOLD,
		color: APP_FONT.MONTSERRAT_BODY,
	},
});
