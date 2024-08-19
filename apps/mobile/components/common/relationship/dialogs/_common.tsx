import { StyleSheet } from 'react-native';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { APP_FONT } from '../../../../styles/AppTheme';
import { Dispatch, memo, SetStateAction } from 'react';
import { Button } from '@rneui/themed';

export const modalStyles = StyleSheet.create({
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

export const ActionButton = memo(
	({
		label,
		setVisible,
		onPress,
	}: {
		label: string;
		setVisible: Dispatch<SetStateAction<boolean>>;
		onPress: () => void;
	}) => {
		return (
			<Button
				size={'md'}
				buttonStyle={{
					backgroundColor: '#404040',
				}}
				containerStyle={{
					borderRadius: 8,
					marginBottom: 12,
				}}
				title={label}
				titleStyle={{
					color: APP_FONT.MONTSERRAT_BODY,
				}}
				loading={false}
				onPress={() => {
					setVisible(false);
					onPress();
				}}
			/>
		);
	},
);
