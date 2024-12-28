import { memo } from 'react';
import {
	NativeSyntheticEvent,
	StyleSheet,
	TextInput,
	TextInputChangeEventData,
	View,
} from 'react-native';
import { APP_THEME } from '../../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import { useComposerContext } from '../api/useComposerContext';
import { PostComposerReducerActionType } from '../../../../../states/reducers/post-composer.reducer';

const ComposerSpoiler = memo(() => {
	const { state, dispatch } = useComposerContext();

	function onChange(e: NativeSyntheticEvent<TextInputChangeEventData>) {
		dispatch({
			type: PostComposerReducerActionType.SET_CW,
			payload: {
				content: e.nativeEvent.text,
			},
		});
	}

	return (
		<View style={{ display: state.isCwVisible ? 'flex' : 'none' }}>
			<TextInput
				autoCapitalize={'none'}
				multiline={true}
				placeholder={'Place your cw here'}
				placeholderTextColor={'rgba(255, 255, 255, 0.33)'}
				style={styles.textInput}
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
		width: '100%',
		maxHeight: 100,
		paddingTop: 16,
		paddingBottom: 0,
		color: APP_THEME.COLOR_SCHEME_C,
		fontFamily: APP_FONTS.INTER_400_REGULAR,
		fontSize: 16,
		borderRadius: 8,
	},
});

export default ComposerSpoiler;
