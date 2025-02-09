import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { StyleSheet, Text, View } from 'react-native';
import { APP_FONTS } from '../../../styles/AppFonts';
import Header from '../components/Header';

function LandingPageView() {
	const { theme } = useAppTheme();

	return (
		<View style={{ flex: 1 }}>
			<Header />
			<View
				style={{
					alignItems: 'center',
					justifyContent: 'center',
					flex: 1,
					paddingBottom: 128,
				}}
			>
				<Text
					style={[
						styles.bodyText,
						{
							color: theme.secondary.a10,
							marginBottom: 32,
							fontSize: 20,
							fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
						},
					]}
				>
					More stuff coming{' '}
					<Text style={{ color: theme.complementary.a0 }}>soon™</Text>
				</Text>
				<Text style={[styles.bodyText, { color: theme.secondary.a10 }]}>
					1) Press 🔍 to start searching
				</Text>
				<Text style={[styles.bodyText, { color: theme.secondary.a10 }]}>
					2)️ Submit (↵) to search.
				</Text>
				<Text style={[styles.bodyText, { color: theme.secondary.a10 }]}>
					3)️ Press 🔍 again to hide widget
				</Text>
				<Text style={[styles.bodyText, { color: theme.secondary.a10 }]}>
					4) Clear (x) to come back here
				</Text>
			</View>
		</View>
	);
}

export default LandingPageView;

const styles = StyleSheet.create({
	bodyText: {
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
		fontSize: 16,
		textAlign: 'left',
		marginBottom: 8,
	},
});
