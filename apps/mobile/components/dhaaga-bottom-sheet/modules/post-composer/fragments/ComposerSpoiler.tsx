import { memo } from 'react';
import {
	NativeSyntheticEvent,
	StyleSheet,
	TextInput,
	TextInputChangeEventData,
	View,
} from 'react-native';
import { useComposerCtx } from '#/features/composer/contexts/useComposerCtx';
import { PostComposerReducerActionType } from '#/features/composer/reducers/composer.reducer';
import { useAppTheme } from '#/states/global/hooks';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';

const ComposerSpoiler = memo(() => {
	const { theme } = useAppTheme();
	const { state, dispatch } = useComposerCtx();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	function onChange(e: NativeSyntheticEvent<TextInputChangeEventData>) {
		dispatch({
			type: PostComposerReducerActionType.SET_CW,
			payload: {
				content: e.nativeEvent.text,
			},
		});
	}

	return (
		<View
			style={{
				display: state.isCwVisible ? 'flex' : 'none',
				paddingHorizontal: 10,
			}}
		>
			<TextInput
				autoCapitalize={'none'}
				multiline={true}
				placeholder={t(`quickPost.spoilerPlaceholder`)}
				placeholderTextColor={theme.secondary.a50}
				style={[
					styles.textInput,
					{
						color: theme.complementary,
					},
				]}
				onChange={onChange}
				value={state.cw}
			/>
		</View>
	);
});

const styles = StyleSheet.create({
	textInput: {
		textDecorationLine: 'none',
		textDecorationStyle: undefined,
		paddingVertical: 8,
		fontSize: 16,
	},
});

export default ComposerSpoiler;
