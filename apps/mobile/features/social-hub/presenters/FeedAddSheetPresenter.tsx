import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { APP_FONTS } from '../../../styles/AppFonts';

function FeedAddSheetPresenter() {
	const { theme } = useAppTheme();

	const title = 'Sorry 😔';
	const desc = [
		'This feature is not implemented yet!',
		'A default set of feed destinations has been populated for you!',
		'Bluesky users can access their feeds from the profile page (5th tab) for now.',
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

export default FeedAddSheetPresenter;

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
