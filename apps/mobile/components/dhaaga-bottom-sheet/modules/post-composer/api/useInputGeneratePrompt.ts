import { useCallback } from 'react';
import { NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';
import {
	usePostComposerDispatch,
	usePostComposerState,
	PostComposerAction,
} from '@dhaaga/react';

const EMOJI_REGEX = /:[a-zA-Z_@]+?$/;
const ACCT_REGEX = /(@[a-zA-Z_0-9.]+(@[a-zA-Z_0-9.]*)?)$/;

function useInputGeneratePrompt() {
	const state = usePostComposerState();
	const dispatch = usePostComposerDispatch();

	function onSelectionChange(e: any) {
		dispatch({
			type: PostComposerAction.SET_KEYBOARD_SELECTION,
			payload: e.nativeEvent.selection,
		});
	}

	const onChange = useCallback(
		(e: NativeSyntheticEvent<TextInputChangeEventData>) => {
			const _regexTarget = e.nativeEvent.text.slice(
				0,
				state.keyboardSelection.start + 1,
			);

			// setter
			const _target = e.nativeEvent.text;

			dispatch({
				type: PostComposerAction.SET_TEXT,
				payload: {
					content: _target,
				},
			});

			if (e.nativeEvent.text === '') {
				dispatch({
					type: PostComposerAction.SET_SEARCH_PROMPT,
					payload: {
						type: 'none',
						q: '',
					},
				});
			}
			if (ACCT_REGEX.test(_regexTarget)) {
				// console.log(_regexTarget, 'matches acct regex');
				const res = ACCT_REGEX.exec(_regexTarget);
				dispatch({
					type: PostComposerAction.SET_SEARCH_PROMPT,
					payload: {
						type: 'acct',
						q: res[0].slice(1, res[0].length),
					},
				});
			} else if (EMOJI_REGEX.test(_regexTarget)) {
				console.log(_regexTarget, 'matches emoji regex');
				const res = EMOJI_REGEX.exec(_regexTarget);
				dispatch({
					type: PostComposerAction.SET_SEARCH_PROMPT,
					payload: {
						type: 'emoji',
						q: res[0].slice(1, res[0].length - 1),
					},
				});
			} else {
				dispatch({
					type: PostComposerAction.SET_SEARCH_PROMPT,
					payload: {
						type: 'none',
						q: '',
					},
				});
			}
		},
		[state.keyboardSelection],
	);

	return { onChange, onSelectionChange };
}

export default useInputGeneratePrompt;
