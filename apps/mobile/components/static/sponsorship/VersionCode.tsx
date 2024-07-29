import { View, Text, StyleSheet } from 'react-native';
import { APP_FONT } from '../../../styles/AppTheme';
import { memo } from 'react';
import { APP_FONTS } from '../../../styles/AppFonts';

/**
 * Renders the software version
 * and build flavor
 */
const VersionCode = memo(() => {
	return (
		<View style={{ marginTop: 16, marginBottom: 0 }}>
			<Text style={styles.text}>{'Built with' + ' 💛 by Debashish Patra'}</Text>
			<Text style={styles.text}>v0.5.0</Text>
		</View>
	);
});

const styles = StyleSheet.create({
	text: {
		textAlign: 'center',
		color: APP_FONT.MONTSERRAT_BODY,
		fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
	},
});

export default VersionCode;
