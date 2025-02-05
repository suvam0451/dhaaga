import { memo } from 'react';
import {
	NativeSyntheticEvent,
	StyleSheet,
	TextInput,
	TextInputChangeEventData,
	View,
} from 'react-native';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import { useComposerCtx } from '../../../../../features/composer/contexts/useComposerCtx';
import { PostComposerReducerActionType } from '../../../../../features/composer/reducers/composer.reducer';
import { useAppTheme } from '../../../../../hooks/utility/global-state-extractors';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../../../types/app.types';

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
						color: theme.complementary.a0,
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
		fontFamily: APP_FONTS.ROBOTO_400,
		fontSize: 16,
	},
});

export default ComposerSpoiler;
