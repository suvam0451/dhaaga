import { useAppBottomSheet, useAppTheme } from '#/states/global/hooks';
import { ScrollView, StyleSheet } from 'react-native';
import { UserTimelineCtx } from '@dhaaga/core';
import { useState } from 'react';
import { useApiGetPostLikes } from '#/hooks/api/usePostInteractions';
import { usePostEventBusActions } from '#/hooks/pubsub/usePostEventBus';
import { NativeTextBold, NativeTextNormal } from '#/ui/NativeText';

function Content() {
	const { theme } = useAppTheme();
	const { ctx } = useAppBottomSheet();
	const postId = ctx && ctx.$type === 'post-id' ? ctx.postId : null;

	const [MaxId, setMaxId] = useState(null);

	const { data, error, isFetching } = useApiGetPostLikes(postId, MaxId);
	const { toggleLike } = usePostEventBusActions(postId);

	const title = 'Sorry 😔';
	const desc = [
		'This feature is not implemented yet!',
		'Unfortunately, there is no other way to view likes :(',
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

function ShowLikesBottomSheet() {
	return (
		<UserTimelineCtx>
			<Content />
		</UserTimelineCtx>
	);
}

export default ShowLikesBottomSheet;

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
