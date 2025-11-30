import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { memo, useRef } from 'react';
import { useComposerCtx } from '../../../../../features/composer/contexts/useComposerCtx';
import useInputGeneratePrompt from '../api/useInputGeneratePrompt';
import { useAppTheme } from '../../../../../hooks/utility/global-state-extractors';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../../../types/app.types';

const ComposerTextInput = memo(function Foo() {
	const { theme } = useAppTheme();
	const { state } = useComposerCtx();

	const { onSelectionChange, onChange } = useInputGeneratePrompt();
	const ref = useRef<TextInput>(null);
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	function onSectionTouched() {
		ref.current?.focus();
	}

	return (
		<ScrollView style={{ flex: 1 }} onTouchStart={onSectionTouched}>
			<TextInput
				ref={ref}
				autoCapitalize={'none'}
				multiline={true}
				placeholder={t(`composer.quickPostCta`)}
				placeholderTextColor={'rgba(255, 255, 255, 0.33)'}
				style={[
					styles.textInput,
					{
						color: theme.secondary.a10,
					},
				]}
				onChange={onChange}
				onSelectionChange={onSelectionChange}
				scrollEnabled={true}
			>
				{state.text}
			</TextInput>
		</ScrollView>
	);
});

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
		fontFamily: APP_FONTS.ROBOTO_400,
		flexGrow: 1,
		height: '100%',
	},
});
