import { useAppTheme } from '#/states/global/hooks';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { NativeTextBold, NativeTextNormal } from '#/ui/NativeText';

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
			<NativeTextBold
				style={[styles.sheetTitle, { color: theme.secondary.a10 }]}
			>
				{title}
			</NativeTextBold>
			{desc.map((o, i) => (
				<NativeTextNormal
					key={i}
					style={[styles.sheetDesc, { color: theme.secondary.a30 }]}
				>
					{o}
				</NativeTextNormal>
			))}
		</ScrollView>
	);
}

export default HubAddTagBottomSheet;

const styles = StyleSheet.create({
	sheetTitle: {
		fontSize: 28,
		textAlign: 'center',
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
