import { memo } from 'react';
import { RelationshipDialogProps } from '../fragments/_common';
import { Dialog } from '@rneui/themed';
import { StyleSheet, Text, View } from 'react-native';
import { APP_FONTS } from '../../../../styles/AppFonts';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { ActionButton, modalStyles } from './_common';

const RelationDialogFactory = memo(
	({
		visible,
		setVisible,
		children,
		label,
		desc,
	}: RelationshipDialogProps & {
		children: any;
		label: string;
		desc: string[];
	}) => {
		const { theme } = useGlobalState(
			useShallow((o) => ({
				theme: o.colorScheme,
			})),
		);

		function dismiss() {
			setVisible(false);
		}

		return (
			<Dialog
				overlayStyle={{
					backgroundColor: theme.palette.menubar,
					borderRadius: 24,
					padding: 0,
				}}
				isVisible={visible}
				onBackdropPress={() => {
					setVisible(false);
				}}
			>
				<View style={{ paddingHorizontal: 24 }}>
					<Text style={[styles.modalTitle, { color: theme.textColor.high }]}>
						{label}
					</Text>
					{desc.map((text, i) => (
						<Text
							key={i}
							style={[
								modalStyles.modalDescription,
								{
									color: theme.textColor.medium,
								},
							]}
						>
							{text}
						</Text>
					))}
				</View>
				<View style={{ marginTop: 32, marginBottom: 4 }}>
					{children}
					<ActionButton
						label={'Dismiss'}
						setVisible={setVisible}
						onPress={dismiss}
					/>
				</View>
			</Dialog>
		);
	},
);

export default RelationDialogFactory;

const styles = StyleSheet.create({
	modalTitle: {
		fontFamily: APP_FONTS.INTER_700_BOLD,
		textAlign: 'center',
		fontSize: 20,
		marginBottom: 16,
		paddingTop: 32,
	},
	modalDescription: {
		fontFamily: APP_FONTS.INTER_400_REGULAR,
		textAlign: 'center',
		fontSize: 14,
	},
	actionButtonContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		marginVertical: 16,
	},
});
