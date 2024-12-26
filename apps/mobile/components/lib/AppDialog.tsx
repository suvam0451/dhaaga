import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
	useAppDialog,
	useAppTheme,
} from '../../hooks/utility/global-state-extractors';
import { useEffect } from 'react';
import { Dialog } from '@rneui/base';
import { APP_FONTS } from '../../styles/AppFonts';
import { modalStyles } from '../common/relationship/dialogs/_common';

type DialogOptionsProps = {
	label: string;
	onPress: () => void;
	variant?: 'default' | 'dismiss';
};

function DialogOption({ label, onPress, variant }: DialogOptionsProps) {
	const { theme } = useAppTheme();

	const color =
		variant && variant === 'dismiss' ? '#fd413b' : theme.textColor.medium;
	return (
		<View>
			<View style={{ height: 1, backgroundColor: '#333' }} />
			<Pressable style={{ paddingVertical: 10 }} onPress={onPress}>
				<Text
					style={{
						fontFamily: APP_FONTS.INTER_500_MEDIUM,
						color: color,
						fontSize: 18,
						textAlign: 'center',
					}}
				>
					{label}
				</Text>
			</Pressable>
		</View>
	);
}

/**
 * A common dialog component that can
 * be invoked from anywhere and provided
 * with single-select action buttons
 * @constructor
 */
export function AppDialog() {
	const { visible, show, hide, state, stateId } = useAppDialog();
	const { theme } = useAppTheme();

	useEffect(() => {}, [stateId]);

	if (!visible) return <View />;
	return (
		<Dialog
			overlayStyle={{
				backgroundColor: theme.palette.menubar,
				borderRadius: 24,
				padding: 0,
			}}
			isVisible={visible}
			onBackdropPress={() => {
				hide();
			}}
		>
			<View style={{ paddingHorizontal: 24 }}>
				<Text style={[styles.modalTitle, { color: theme.textColor.high }]}>
					{state.title}
				</Text>
				{state.description.map((text, i) => (
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
				{state.actions.map((action, i) => (
					<DialogOption label={action.label} onPress={action.onPress} />
				))}
				<DialogOption
					label={'Dismiss'}
					onPress={() => {
						hide();
					}}
					variant={'dismiss'}
				/>
			</View>
		</Dialog>
	);
}

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
