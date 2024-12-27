import { ScrollView, StyleSheet, Text } from 'react-native';
import { APP_FONTS } from '../../../styles/AppFonts';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';

function ABS_Post_Show_Comments() {
	const { theme } = useAppTheme();
	const title = 'Sorry 😔';
	const desc = [
		'This feature is not implemented yet!',
		'But, you can still enter the post details page to view replies!',
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

export default ABS_Post_Show_Comments;

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
