import { ScrollView, StyleSheet, TextInput, Pressable } from 'react-native';
import { useRef } from 'react';
import useInputGeneratePrompt from '#/components/dhaaga-bottom-sheet/modules/post-composer/api/useInputGeneratePrompt';
import { useAppTheme } from '#/states/global/hooks';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { usePostComposerState } from '@dhaaga/react';

function ComposerTextInput() {
	const { theme } = useAppTheme();
	const state = usePostComposerState();

	const { onSelectionChange, onChange } = useInputGeneratePrompt();
	const ref = useRef<TextInput>(null);
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	function onSectionTouched() {
		ref.current?.focus();
	}

	return (
		<Pressable style={{ flex: 1, height: '100%' }} onPress={onSectionTouched}>
			<ScrollView style={{ flex: 1 }}>
				<TextInput
					ref={ref}
					autoCapitalize={'none'}
					multiline={true}
					placeholder={t(`composer.quickPostCta`)}
					placeholderTextColor={theme.secondary.a20}
					style={[
						styles.textInput,
						{
							color: theme.secondary.a0,
						},
					]}
					onChange={onChange}
					onSelectionChange={onSelectionChange}
					scrollEnabled={true}
				>
					{state.text}
				</TextInput>
			</ScrollView>
		</Pressable>
	);
}

export default ComposerTextInput;

const styles = StyleSheet.create({
	textInput: {
		textDecorationLine: 'none',
		textDecorationStyle: undefined,
		paddingVertical: 8,
		fontSize: 16,
		borderRadius: 8,
		flex: 1,
		marginHorizontal: 10,
		textAlignVertical: 'top',
		flexGrow: 1,
		height: '100%',
	},
});
