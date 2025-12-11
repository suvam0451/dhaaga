import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { APP_FONTS } from '#/styles/AppFonts';
import {
	useAppBottomSheet,
	useAppPublishers,
	useAppTheme,
} from '#/states/global/hooks';
import { useApiGetPostComments } from '#/hooks/api/usePostInteractions';
import { useEffect, useState } from 'react';

function ShowCommentsBottomSheet() {
	const { theme } = useAppTheme();
	const { ctx, stateId, hide } = useAppBottomSheet();
	const { postObjectActions } = useAppPublishers();

	const [MaxId, setMaxId] = useState(null);

	const { data, error } = useApiGetPostComments(
		ctx.$type === 'post-id' ? ctx.postId : null,
		MaxId,
	);
	console.log(data);

	return <View />;
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

export default ShowCommentsBottomSheet;

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
