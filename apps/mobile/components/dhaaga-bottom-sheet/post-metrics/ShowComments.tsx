import { ScrollView, StyleSheet, Text } from 'react-native';
import { APP_FONTS } from '#/styles/AppFonts';
import {
	useAppBottomSheet,
	useAppPublishers,
	useAppTheme,
} from '#/hooks/utility/global-state-extractors';
import { useApiGetPostComments } from '#/hooks/api/usePostInteractions';
import { useEffect, useState } from 'react';

function ShowComments() {
	const { theme } = useAppTheme();
	const { ctx, stateId, hide } = useAppBottomSheet();
	const { postObjectActions } = useAppPublishers();

	const [MaxId, setMaxId] = useState(null);

	const title = 'Sorry 😔';
	const {} = useApiGetPostComments(ctx?.uuid, MaxId);

	const [Post, setPost] = useState(postObjectActions.read(ctx?.uuid));

	useEffect(() => {
		function update({ uuid }: { uuid: string }) {
			setPost(postObjectActions.read(uuid));
		}
		postObjectActions.subscribe(ctx.uuid, update);
		return () => {
			postObjectActions.unsubscribe(ctx.uuid, update);
		};
	}, [ctx, stateId]);

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

export default ShowComments;

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
