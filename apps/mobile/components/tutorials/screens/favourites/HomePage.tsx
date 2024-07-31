import { View, Text, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { APP_FONT } from '../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../styles/AppFonts';

function FavouritesScreenHomePageDefaultTutorial() {
	return (
		<View style={{ padding: 8 }}>
			<View style={styles.welcomeText}>
				<View
					style={{
						display: 'flex',
						position: 'absolute',
						left: '100%',
					}}
				>
					<View style={{ marginTop: 8, marginLeft: -4 }}>
						<MaterialIcons
							name="help-outline"
							size={24}
							style={{ marginLeft: 4 }}
							color={APP_FONT.MONTSERRAT_BODY}
						/>
					</View>
				</View>

				<Text
					style={{
						fontSize: 24,
						textAlign: 'center',
						color: APP_FONT.MONTSERRAT_HEADER,
						fontFamily: APP_FONTS.MONTSERRAT_600_SEMIBOLD,
					}}
				>
					Welcome !
				</Text>

				<Text style={styles.welcomeDescriptionSection}>
					Here, you can browse your saved statuses/tags and manage your network.
				</Text>
				<Text style={styles.welcomeDescriptionSection}>
					If you are new to mastodon and need help, click help icon for a
					explainer 😉
				</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	welcomeText: {
		padding: 16,
		position: 'relative',
		borderWidth: 2,
		borderColor: '#ffffff60',
		borderRadius: 8,
		marginTop: 16,
	},
	welcomeDescriptionSection: {
		fontSize: 16,
		textAlign: 'center',
		marginTop: 4,
		color: APP_FONT.MONTSERRAT_BODY,
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
	},
});

export default FavouritesScreenHomePageDefaultTutorial;
