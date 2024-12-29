import { StyleSheet, TextInput, View } from 'react-native';
import { memo, useRef } from 'react';
import { useComposerContext } from '../api/useComposerContext';
import useInputGeneratePrompt from '../api/useInputGeneratePrompt';
import { useAppTheme } from '../../../../../hooks/utility/global-state-extractors';

const ComposerTextInput = memo(function Foo() {
	const { theme } = useAppTheme();
	const { state } = useComposerContext();

	const { onSelectionChange, onChange } = useInputGeneratePrompt();
	const ref = useRef<TextInput>(null);

	return (
		<View
			style={{
				flexGrow: 1,
				height: '100%',
			}}
		>
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
				{state.text}
			</TextInput>
		</View>
	);
});

export default ComposerTextInput;

const styles = StyleSheet.create({
	textInput: {
		textDecorationLine: 'none',
		textDecorationStyle: undefined,
		marginTop: 16,
		fontSize: 16,
		borderRadius: 8,
		textAlignVertical: 'top',
		paddingBottom: 0,
		flexGrow: 1,
	},
});
