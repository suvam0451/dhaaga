import { StyleProp, TextInput, TextStyle, StyleSheet } from 'react-native';
import { useAppTheme } from '../../hooks/utility/global-state-extractors';
import { APP_FONTS } from '../../styles/AppFonts';

type AppTextInput_SingleLineProps = {
	value: string;
	placeholder: string;
	onChangeText: (o: any) => void;
	style?: StyleProp<TextStyle>;
	autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
};

export class AppTextInput {
	static SingleLine({
		onChangeText,
		placeholder,
		style,
		autoCapitalize,
		value,
	}: AppTextInput_SingleLineProps) {
		const { theme } = useAppTheme();
		return (
			<TextInput
				placeholder={placeholder}
				autoCapitalize={autoCapitalize || 'none'}
				multiline={false}
				placeholderTextColor={theme.secondary.a40}
				style={[
					styles.singleLine,
					{ color: theme.secondary.a20, fontFamily: APP_FONTS.ROBOTO_500 },
					style,
				]}
				onChangeText={onChangeText}
				value={value}
			/>
		);
	}
}

const styles = StyleSheet.create({
	singleLine: {
		textDecorationLine: 'none',
	},
});
