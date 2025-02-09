import {
	Pressable,
	StyleProp,
	StyleSheet,
	Text,
	View,
	ViewStyle,
} from 'react-native';
import {
	useAppDialog,
	useAppTheme,
} from '../../hooks/utility/global-state-extractors';
import { APP_FONTS } from '../../styles/AppFonts';
import { Fragment, useEffect, useState } from 'react';
import { Loader } from './Loader';
import { AppTextInput } from './TextInput';
import { appDimensions, appVerticalIndex } from '../../styles/dimensions';
import { AppText } from './Text';

type DialogOptionsProps = {
	label: string;
	onPress: () => Promise<void>;
	variant?: 'default' | 'dismiss' | 'destructive';
	style?: StyleProp<ViewStyle>;
};

function DialogOption({ label, onPress, variant, style }: DialogOptionsProps) {
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
			setIsLoading(false);
		}
	}

	const color =
		variant && (variant === 'dismiss' || variant === 'destructive')
			? '#fd413b'
			: theme.secondary.a10;

	return (
		<View style={style}>
			<View style={{ height: 1, backgroundColor: theme.background.a50 }} />
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
		setInput('');
	}, [stateId, textSeed]);

	const IS_TXT_MODE =
		textSeed !== null && textSeed !== undefined && !!textSubmitCallback;

	if (!visible) return <View />;
	return (
		<Fragment>
			<Pressable style={styles.backdrop} onPress={hide} />
			<View
				style={[
					styles.root,
					{
						backgroundColor: theme.background.a20,
						transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
					},
				]}
			>
				<View
					style={{ paddingHorizontal: 24, marginBottom: MARGIN_BOTTOM * 2 }}
				>
					<AppText.SemiBold
						style={[styles.modalTitle, { color: theme.primary.a0 }]}
					>
						{state.title}
					</AppText.SemiBold>

					{state.description.map((text, i) => (
						<AppText.Medium
							key={i}
							style={[
								styles.modalDescription,
								{
									color: theme.secondary.a20,
									fontSize: 15,
								},
							]}
						>
							{text}
						</AppText.Medium>
					))}
					{IS_TXT_MODE && (
						<AppTextInput.SingleLine
							placeholder={textSeed}
							onChangeText={setInput}
							value={Input}
							style={{
								fontSize: 16,
								textAlign: 'center',
								fontFamily: APP_FONTS.ROBOTO_500,
								color: theme.primary.a0,
								textDecorationLine: 'none',
								paddingVertical: 20,
							}}
						/>
					)}
				</View>

				{/* ---- Additional Dialog Options ---- */}
				{state.actions.map((action, i) => (
					<DialogOption
						key={i}
						label={action.label}
						onPress={action.onPress}
						variant={(action.variant || 'default') as any}
					/>
				))}

				{/* ---- Save Option (TextInput Dialogs) ---- */}
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

				{/* ---- Dismiss Option (Universal) ---- */}
				<DialogOption
					label={'Dismiss'}
					onPress={async () => {
						hide();
					}}
					variant={'dismiss'}
					style={{ paddingBottom: MARGIN_BOTTOM * 0.5 }}
				/>
			</View>
		</Fragment>
	);
}

const MARGIN_BOTTOM = appDimensions.timelines.sectionBottomMargin;

const styles = StyleSheet.create({
	root: {
		maxWidth: '75%',
		borderRadius: 8,
		zIndex: appVerticalIndex.dialogContent,
		position: 'absolute',
		left: '50%',
		top: '50%',
	},
	modalTitle: {
		textAlign: 'center',
		fontSize: 22,
		marginBottom: 16,
		paddingTop: 32,
	},
	modalDescription: {
		fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
		textAlign: 'center',
		fontSize: 16,
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
	backdrop: {
		position: 'absolute',
		backgroundColor: 'black',
		height: '100%',
		width: '100%',
		opacity: 0.64,
		zIndex: appVerticalIndex.dialogBackdrop,
	},
});
