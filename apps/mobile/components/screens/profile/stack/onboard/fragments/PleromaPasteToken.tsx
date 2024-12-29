import { Dispatch, memo, SetStateAction } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { APP_FONT } from '../../../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../../../styles/AppFonts';

type PleromaPasteTokenProps = {
	domain: string;
	setCode: Dispatch<SetStateAction<string>>;
};

const PleromaPasteToken = memo(
	({ domain, setCode }: PleromaPasteTokenProps) => {
		function onChangeText(input: string) {
			console.log(input);
			setCode(input);
		}

		if (domain === KNOWN_SOFTWARE.MASTODON) return <View />;

		if (domain !== KNOWN_SOFTWARE.PLEROMA && domain !== KNOWN_SOFTWARE.AKKOMA)
			return <View />;

		return (
			<View>
				<TextInput
					multiline={false}
					placeholder={'Paste Pleroma/Akkoma token here'}
					placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
					style={styles.textInput}
					autoCapitalize={'none'}
					onChangeText={onChangeText}
				/>
			</View>
		);
	},
);

const styles = StyleSheet.create({
	textInput: {
		textDecorationLine: 'none',
		textDecorationStyle: undefined,
		color: APP_FONT.MONTSERRAT_HEADER,
		fontSize: 16,
		fontFamily: APP_FONTS.INTER_400_REGULAR,
		// marginBottom: 24,
	},
});

export default PleromaPasteToken;
