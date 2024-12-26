import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
	useAppDialog,
	useAppTheme,
} from '../../hooks/utility/global-state-extractors';
import { APP_FONTS } from '../../styles/AppFonts';
import { modalStyles } from '../common/relationship/dialogs/_common';
import { Fragment } from 'react';

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
	const { visible, hide, state } = useAppDialog();
	const { theme } = useAppTheme();

	if (!visible) return <View />;
	return (
		<Fragment>
			<Pressable
				style={{
					position: 'absolute',
					backgroundColor: 'black',
					height: '100%',
					width: '100%',
					opacity: 0.64,
				}}
				onPress={hide}
			/>
			<View
				style={{
					maxWidth: 256,
					borderRadius: 8,
					backgroundColor: theme.palette.menubar,
					position: 'absolute',
					left: '50%',
					top: '50%',
					transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
				}}
			>
				<View>
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
							<DialogOption
								key={i}
								label={action.label}
								onPress={action.onPress}
							/>
						))}
						<DialogOption
							label={'Dismiss'}
							onPress={() => {
								hide();
							}}
							variant={'dismiss'}
						/>
					</View>
				</View>
			</View>
		</Fragment>
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
