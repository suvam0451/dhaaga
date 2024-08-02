import {
	NativeSyntheticEvent,
	StyleSheet,
	TextInput,
	TextInputChangeEventData,
	TextInputFocusEventData,
	TextInputKeyPressEventData,
} from 'react-native';
import { APP_FONT } from '../../../../../styles/AppTheme';
import { memo, useCallback } from 'react';
import { useComposerContext } from '../api/useComposerContext';

const EMOJI_REGEX = /:[a-zA-Z_@]+?$/;
const ACCT_REGEX = /(@[a-zA-Z_0-9.]+(@[a-zA-Z_0-9.]*)?)$/;

const ComposerTextInput = memo(function Foo() {
	const {
		setAutoCompletionPrompt,
		rawText,
		setRawText,
		editorText,
		setSelection,
		selection,
	} = useComposerContext();

	const onBackspaceClicked = useCallback(
		(nativeEvent: TextInputKeyPressEventData) => {},
		[rawText],
	);

	function onSelectionChange(e: any) {
		setSelection(e.nativeEvent.selection);
		if (e.nativeEvent.selection.start !== e.nativeEvent.selection.end) return;
		if (rawText.length === e.nativeEvent.selection) return;
		if (rawText[e.nativeEvent.selection.start + 1] !== ' ') return;
		const subsection = rawText.slice(0, e.nativeEvent.selection.start);
	}

	const onChangeText = useCallback(
		(e: NativeSyntheticEvent<TextInputChangeEventData>) => {
			const _regexTarget = e.nativeEvent.text.slice(0, selection.start + 1);

			// setter
			const _target = e.nativeEvent.text;
			setRawText(_target);

			if (ACCT_REGEX.test(_regexTarget)) {
				console.log(_regexTarget, 'matches acct regex');
				const res = ACCT_REGEX.exec(_regexTarget);
				setAutoCompletionPrompt({
					type: 'acct',
					q: res[0].slice(1, res[0].length),
				});
			} else if (EMOJI_REGEX.test(_regexTarget)) {
				const res = EMOJI_REGEX.exec(_regexTarget);
				setAutoCompletionPrompt({
					type: 'emoji',
					q: res[0].slice(1, res[0].length - 1),
				});
			} else {
				setAutoCompletionPrompt({
					type: 'none',
					q: '',
				});
			}
		},
		[rawText],
	);

	return (
		<TextInput
			multiline={true}
			placeholder={"What's on your mind?"}
			placeholderTextColor={'rgba(255, 255, 255, 0.33)'}
			style={styles.textInput}
			onKeyPress={({ nativeEvent }) => {
				if (nativeEvent.key === 'Backspace') {
					onBackspaceClicked(nativeEvent);
					return null;
				}
			}}
			onChange={onChangeText}
			// onChangeText={onChangeText}
			onBlur={(e: NativeSyntheticEvent<TextInputFocusEventData>) => {
				e.preventDefault();
			}}
			onSelectionChange={onSelectionChange}
		>
			{rawText}
		</TextInput>
	);
});

export default ComposerTextInput;

const styles = StyleSheet.create({
	textInput: {
		textDecorationLine: 'none',
		textDecorationStyle: undefined,
		width: '100%',
		maxHeight: 200,
		// height: 48,
		paddingVertical: 16,
		// paddingLeft: 16,
		color: APP_FONT.MONTSERRAT_BODY,
		fontSize: 16,
		borderRadius: 8,
		// paddingBottom: 13,
		// backgroundColor: 'red',
	},
	rootContainer: {
		position: 'absolute',
		bottom: 0,
		width: '100%',
		borderTopRightRadius: 8,
		borderTopLeftRadius: 8,
		// paddingHorizontal: 16,
		backgroundColor: '#2C2C2C',
		// paddingVertical: 16,
	},
	bottomSheetContentContainer: {
		padding: 16,
		height: '100%',
	},
});
