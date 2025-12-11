import { useAppTheme } from '#/states/global/hooks';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { APP_FONTS } from '#/styles/AppFonts';

function HubAddTagBottomSheet() {
	const { theme } = useAppTheme();
	const title = 'Sorry 😔';
	const desc = [
		'This feature is not implemented yet!',
		'Please either click a tag from your timeline, ' +
			'or add it from the timeline relevant to the tag',
		'The feature to add users directly will be implemented in a later patch',
	];

	return (
		<ScrollView>
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

export default HubAddTagBottomSheet;

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
