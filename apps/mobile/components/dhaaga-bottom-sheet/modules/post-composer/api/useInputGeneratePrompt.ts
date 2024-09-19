import { useCallback } from 'react';
import { useComposerContext } from './useComposerContext';
import { NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';

const EMOJI_REGEX = /:[a-zA-Z_@]+?$/;
const ACCT_REGEX = /(@[a-zA-Z_0-9.]+(@[a-zA-Z_0-9.]*)?)$/;

function useInputGeneratePrompt() {
	const { setAutoCompletionPrompt, setRawText, setSelection, selection } =
		useComposerContext();

	const onSelectionChange = useCallback((e: any) => {
		setSelection(e.nativeEvent.selection);
	}, []);

	const onChange = useCallback(
		(e: NativeSyntheticEvent<TextInputChangeEventData>) => {
			const _regexTarget = e.nativeEvent.text.slice(0, selection.start + 1);

			// setter
			const _target = e.nativeEvent.text;
			setRawText(_target);

			if (e.nativeEvent.text === '') {
				setAutoCompletionPrompt({
					type: 'none',
					q: '',
				});
			}
			if (ACCT_REGEX.test(_regexTarget)) {
				// console.log(_regexTarget, 'matches acct regex');
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
		[setAutoCompletionPrompt, selection, setRawText],
	);

	return { onChange, onSelectionChange };
}

export default useInputGeneratePrompt;
