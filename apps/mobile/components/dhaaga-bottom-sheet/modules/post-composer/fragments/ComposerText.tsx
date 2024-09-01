import { StyleSheet, TextInput } from 'react-native';
import { APP_FONT } from '../../../../../styles/AppTheme';
import { memo } from 'react';
import { useComposerContext } from '../api/useComposerContext';
import useInputGeneratePrompt from '../api/useInputGeneratePrompt';

const ComposerTextInput = memo(function Foo() {
	const { rawText } = useComposerContext();

	const { onSelectionChange, onChange } = useInputGeneratePrompt();

	return (
		<TextInput
			autoCapitalize={'none'}
			multiline={true}
			placeholder={"What's on your mind?"}
			placeholderTextColor={'rgba(255, 255, 255, 0.33)'}
			style={styles.textInput}
			onChange={onChange}
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
		paddingVertical: 16,
		color: APP_FONT.MONTSERRAT_BODY,
		fontSize: 16,
		borderRadius: 8,
	},
});
