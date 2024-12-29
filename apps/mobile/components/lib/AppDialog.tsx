import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
	useAppDialog,
	useAppTheme,
} from '../../hooks/utility/global-state-extractors';
import { APP_FONTS } from '../../styles/AppFonts';
import { modalStyles } from '../common/relationship/dialogs/_common';
import { Fragment, useEffect, useState } from 'react';
import { Loader } from './Loader';
import { AppTextInput } from './TextInput';

type DialogOptionsProps = {
	label: string;
	onPress: () => Promise<void>;
	variant?: 'default' | 'dismiss' | 'destructive';
};

function DialogOption({ label, onPress, variant }: DialogOptionsProps) {
	const [IsLoading, setIsLoading] = useState(false);
	const { theme } = useAppTheme();

	function _onPress() {
		if (IsLoading) return;
		setIsLoading(true);
		try {
			// FIXME: unable to access finally of undefined
			onPress().finally(() => {
				setIsLoading(false);
			});
		} catch (e) {
			//
			// setIsLoading(false);
		}
	}

	const color =
		variant && (variant === 'dismiss' || variant === 'destructive')
			? '#fd413b'
			: theme.textColor.medium;

	return (
		<View>
			<View style={{ height: 1, backgroundColor: '#333' }} />

			{IsLoading ? (
				<View style={{ paddingVertical: 19 }}>
					<Loader />
				</View>
			) : (
				<Pressable style={{ paddingVertical: 10 }} onPress={_onPress}>
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
			)}
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
	const { visible, hide, state, textSeed, textSubmitCallback, stateId } =
		useAppDialog();
	const { theme } = useAppTheme();
	const [Input, setInput] = useState(null);

	useEffect(() => {
		setInput(textSeed);
	}, [stateId, textSeed]);

	const IS_TXT_MODE =
		textSeed !== null && textSeed !== undefined && !!textSubmitCallback;

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
					maxWidth: '80%',
					borderRadius: 8,
					backgroundColor: theme.palette.menubar,
					zIndex: 2000,
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
						{IS_TXT_MODE && (
							<AppTextInput.SingleLine
								placeholder={'Your input here'}
								onChangeText={setInput}
								value={Input}
								style={{
									fontSize: 16,
									textAlign: 'center',
									marginTop: 20,
								}}
							/>
						)}
					</View>
					<View style={{ marginTop: 32, marginBottom: 4 }}>
						{state.actions.map((action, i) => (
							<DialogOption
								key={i}
								label={action.label}
								onPress={action.onPress}
								variant={(action.variant || 'default') as any}
							/>
						))}
						{IS_TXT_MODE && (
							<DialogOption
								label={'Save'}
								onPress={async () => {
									textSubmitCallback(Input);
									hide();
								}}
								variant={'default'}
							/>
						)}
						<DialogOption
							label={'Dismiss'}
							onPress={async () => {
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
		fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
		textAlign: 'center',
		fontSize: 22,
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
	animDotContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
