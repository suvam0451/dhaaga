import {
	Pressable,
	StyleProp,
	StyleSheet,
	View,
	ViewStyle,
} from 'react-native';
import { useAppDialog, useAppTheme } from '#/states/global/hooks';
import { Fragment, useEffect, useState } from 'react';
import { Loader } from './Loader';
import { AppTextInput } from './TextInput';
import { appDimensions, appVerticalIndex } from '#/styles/dimensions';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { NativeTextBold, NativeTextNormal } from '#/ui/NativeText';

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
					<NativeTextBold
						style={{
							color: color,
							fontSize: 18,
							textAlign: 'center',
						}}
					>
						{label}
					</NativeTextBold>
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
	const {
		visible,
		hide,
		title,
		description,
		state,
		actions,
		stateId,
		setState,
		submit,
	} = useAppDialog();
	const { theme } = useAppTheme();
	const [Input, setUserInput] = useState(null);
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	useEffect(() => {
		if (!state) return;
		if (state.$type === 'text-prompt') setUserInput(state.userInput ?? '');
	}, [stateId]);

	if (!visible) return <View />;

	const IS_TXT_MODE = state?.$type === 'text-prompt';

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
					<NativeTextBold style={[styles.modalTitle, { color: theme.primary }]}>
						{title}
					</NativeTextBold>

					{description.map((text, i) => (
						<NativeTextNormal
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
						</NativeTextNormal>
					))}
					{IS_TXT_MODE && (
						<AppTextInput.SingleLine
							placeholder={state.placeholder}
							onChangeText={setUserInput}
							value={Input}
							style={{
								fontSize: 16,
								textAlign: 'center',
								color: theme.primary,
								textDecorationLine: 'none',
								paddingVertical: 20,
							}}
						/>
					)}
				</View>

				{/* ---- Additional Dialog Options ---- */}
				{actions.map((action, i) => (
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
						label={t(`dialogs.saveOption`)}
						onPress={async () => {
							setState({
								...state,
								userInput: Input,
							});
							submit();
						}}
						variant={'default'}
					/>
				)}

				{/* ---- Dismiss Option (Universal) ---- */}
				<DialogOption
					label={t(`dialogs.dismissOption`)}
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
		textAlign: 'center',
		fontSize: 16,
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
