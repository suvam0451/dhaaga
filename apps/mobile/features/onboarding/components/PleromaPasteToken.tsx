import { Dispatch, SetStateAction } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { APP_FONT } from '#/styles/AppTheme';

type PleromaPasteTokenProps = {
	domain: string;
	setCode: Dispatch<SetStateAction<string | null>>;
};

function PleromaPasteToken({ domain, setCode }: PleromaPasteTokenProps) {
	function onChangeText(input: string) {
		setCode(input);
	}

	if (domain === KNOWN_SOFTWARE.MASTODON) return <View />;

	if (domain !== KNOWN_SOFTWARE.PLEROMA && domain !== KNOWN_SOFTWARE.AKKOMA)
		return <View />;

	return (
		<View style={{ paddingVertical: 16 }}>
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
}

const styles = StyleSheet.create({
	textInput: {
		textDecorationLine: 'none',
		textDecorationStyle: undefined,
		color: APP_FONT.MONTSERRAT_HEADER,
		fontSize: 16,
	},
});

export default PleromaPasteToken;
