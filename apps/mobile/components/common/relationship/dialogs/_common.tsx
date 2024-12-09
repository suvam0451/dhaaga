import { StyleSheet } from 'react-native';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { APP_FONT } from '../../../../styles/AppTheme';
import { Dispatch, memo, SetStateAction } from 'react';
import { Button } from '@rneui/themed';
import { useAppTheme } from '../../../../hooks/app/useAppThemePack';

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

/**
 * Closes the modal and performs
 * the requested action (async)
 */
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
		const { colorScheme } = useAppTheme();
		return (
			<Button
				size={'md'}
				buttonStyle={{
					backgroundColor: colorScheme.palette.buttonUnstyled,
					borderRadius: 8,
				}}
				containerStyle={{
					borderRadius: 8,
					marginBottom: 12,
				}}
				title={label}
				titleStyle={{
					color: colorScheme.textColor.high,
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
