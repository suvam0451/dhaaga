import {
	useAppBottomSheet,
	useAppPublishers,
	useAppTheme,
} from '#/hooks/utility/global-state-extractors';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { APP_FONTS } from '#/styles/AppFonts';
import { UserTimelineCtx } from '@dhaaga/core';
import { useEffect, useState } from 'react';
import { useApiGetPostLikes } from '#/hooks/api/usePostInteractions';

function Content() {
	const { theme } = useAppTheme();
	const { ctx, stateId, hide } = useAppBottomSheet();
	const { postObjectActions } = useAppPublishers();

	const [MaxId, setMaxId] = useState(null);
	const { data, error, isFetching } = useApiGetPostLikes(ctx?.uuid, MaxId);

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

	const title = 'Sorry 😔';
	const desc = [
		'This feature is not implemented yet!',
		'Unfortunately, there is no other way to view likes :(',
		'Good software takes time to build. Soon™',
	];

	console.log('likes', data, error, ctx?.uuid);
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

function ShowLikes() {
	return (
		<UserTimelineCtx>
			<Content />
		</UserTimelineCtx>
	);
}

export default ShowLikes;

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
