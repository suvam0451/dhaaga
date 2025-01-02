import { Pressable, StyleSheet, View, Text } from 'react-native';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { APP_FONT } from '../../../../styles/AppTheme';
import { Dispatch, memo, SetStateAction } from 'react';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

export const modalStyles = StyleSheet.create({
	modalTitle: {
		fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
		textAlign: 'center',
		color: APP_FONT.MONTSERRAT_BODY,
		fontSize: 18,
		marginBottom: 16,
	},
	modalDescription: {
		fontFamily: APP_FONTS.MONTSERRAT_600_SEMIBOLD,
		textAlign: 'center',
		color: APP_FONT.MONTSERRAT_BODY,
		fontSize: 14,
	},
	actionButtonContainer: {
		marginVertical: 16,
		marginTop: 32,
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
		const { theme } = useGlobalState(
			useShallow((o) => ({
				theme: o.colorScheme,
			})),
		);
		function onOptionPressed() {
			onPress();
			setVisible(false);
		}

		return (
			<View>
				<View style={{ height: 1, backgroundColor: '#333' }} />
				<Pressable style={{ paddingVertical: 10 }} onPress={onOptionPressed}>
					<Text
						style={{
							fontFamily: APP_FONTS.INTER_500_MEDIUM,
							color: theme.textColor.medium,
							fontSize: 18,
							textAlign: 'center',
						}}
					>
						{label}
					</Text>
				</Pressable>
			</View>
		);
	},
);
