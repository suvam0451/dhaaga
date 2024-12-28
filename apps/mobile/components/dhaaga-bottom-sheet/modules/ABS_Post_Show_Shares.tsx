import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { APP_FONTS } from '../../../styles/AppFonts';

function ABS_Post_Show_Shares() {
	const { theme } = useAppTheme();
	const title = 'Sorry 😔';
	const desc = [
		'This feature is not implemented yet!',
		'Unfortunately, there is no other way to view who else has shared this post :(',
		'Good software takes time to build. Soon™',
	];

	return (
		<ScrollView contentContainerStyle={{ padding: 10 }}>
			<Text style={[styles.sheetTitle, { color: theme.secondary.a10 }]}>
				{title}
			</Text>
			{desc.map((o, i) => (
				<Text
					key={i}
					style={[styles.sheetDesc, { color: theme.secondary.a30 }]}
				>
					{o}
				</Text>
			))}
		</ScrollView>
	);
}

export default ABS_Post_Show_Shares;

const styles = StyleSheet.create({
	sheetTitle: {
		fontSize: 28,
		textAlign: 'center',
		fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
		marginTop: 48,
		marginBottom: 24,
	},
	sheetDesc: {
		fontSize: 16,
		textAlign: 'center',
		marginBottom: 8,
		maxWidth: 256,
		alignSelf: 'center',
	},
});
