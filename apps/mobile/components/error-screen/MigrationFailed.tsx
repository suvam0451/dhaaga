import { memo } from 'react';
import { StatusBar, Text, View, StyleSheet } from 'react-native';
import { APP_FONT, APP_THEME } from '../../styles/AppTheme';
import { APP_FONTS } from '../../styles/AppFonts';

const MigrationFailed = memo(() => {
	return (
		<View style={{ flex: 1, backgroundColor: '#121212' }}>
			{/*<StatusBar backgroundColor={APP_THEME.DARK_THEME_MENUBAR} />*/}
			<View style={{ paddingTop: 54 + 64, paddingHorizontal: 16 }}>
				<Text style={styles.text}>
					It seems, unfortunately, that the database migrations required by the
					app were not applied successfully.
				</Text>
				<Text style={styles.text}>
					You may continue using the app, but there could be unknown bugs that
					might arise because of this.
				</Text>
				<Text style={styles.text}>
					Please re-install the app to fix the problem.
				</Text>
			</View>
		</View>
	);
});

export default MigrationFailed;

const styles = StyleSheet.create({
	text: {
		color: APP_FONT.MONTSERRAT_HEADER,
		textAlign: 'center',
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
		marginBottom: 32,
	},
});
