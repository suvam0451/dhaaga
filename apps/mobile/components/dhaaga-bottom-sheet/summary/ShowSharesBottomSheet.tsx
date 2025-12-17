import { useAppTheme } from '#/states/global/hooks';
import { ScrollView, StyleSheet } from 'react-native';
import { NativeTextBold, NativeTextNormal } from '#/ui/NativeText';

function ShowSharesBottomSheet() {
	const { theme } = useAppTheme();
	const title = 'Sorry 😔';
	const desc = [
		'This feature is not implemented yet!',
		'Unfortunately, there is no other way to view who else has shared this post :(',
		'Good software takes time to build. Soon™',
	];

	return (
		<ScrollView contentContainerStyle={{ padding: 10 }}>
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

export default ShowSharesBottomSheet;

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
