import { StyleSheet, TextInput } from 'react-native';
import { APP_FONT } from '../../../../../styles/AppTheme';
import { memo, useRef } from 'react';
import { useComposerContext } from '../api/useComposerContext';
import useInputGeneratePrompt from '../api/useInputGeneratePrompt';
import useGlobalState from '../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

const ComposerTextInput = memo(function Foo() {
	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);
	const { rawText } = useComposerContext();

	const { onSelectionChange, onChange } = useInputGeneratePrompt();
	const ref = useRef<TextInput>(null);

	return (
		<TextInput
			ref={ref}
			autoCapitalize={'none'}
			multiline={true}
			placeholder={"What's on your mind?"}
			placeholderTextColor={'rgba(255, 255, 255, 0.33)'}
			style={[styles.textInput, { color: theme.textColor.high }]}
			onChange={onChange}
			onSelectionChange={onSelectionChange}
			scrollEnabled={true}
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
		marginTop: 16,
		color: APP_FONT.MONTSERRAT_BODY,
		fontSize: 16,
		borderRadius: 8,
		height: 'auto',
		flex: 1,
		textAlignVertical: 'top',
		paddingBottom: 0,
	},
});
