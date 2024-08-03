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

const ComposerSpoiler = memo(() => {
	const { cwShown, setCw } = useComposerContext();

	function onChange(e: NativeSyntheticEvent<TextInputChangeEventData>) {
		setCw(e.nativeEvent.text);
	}

	return (
		<View style={{ display: cwShown ? 'flex' : 'none' }}>
			<TextInput
				autoCapitalize={'none'}
				multiline={true}
				placeholder={'Place your cw here'}
				placeholderTextColor={'rgba(255, 255, 255, 0.33)'}
				style={styles.textInput}
				onChange={onChange}
				// onSelectionChange={onSelectionChange}
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
