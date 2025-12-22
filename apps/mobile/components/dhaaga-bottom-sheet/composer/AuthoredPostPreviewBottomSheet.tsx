import {
	useAppApiClient,
	useAppBottomSheet,
	useAppDialog,
	useAppTheme,
} from '#/states/global/hooks';
import { useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { NativeTextBold } from '#/ui/NativeText';
import BottomSheetMenu from '#/components/dhaaga-bottom-sheet/components/BottomSheetMenu';
import { PostMutator } from '@dhaaga/bridge';
import { usePostEventBusStore } from '#/hooks/pubsub/usePostEventBus';
import TimelinePostItemView from '#/features/post-item-view/TimelinePostItemView';

function AuthoredPostPreviewBottomSheet() {
	const { client } = useAppApiClient();
	const { ctx } = useAppBottomSheet();
	const { theme } = useAppTheme();
	const [IsDeleted, setIsDeleted] = useState(false);
	const { show, hide } = useAppDialog();

	const { post } = usePostEventBusStore(
		ctx.$type === 'post-preview' ? ctx.postId : null,
	);

	async function onDeleteConfirm() {
		try {
			const result = await PostMutator.delete(client, post);
			setIsDeleted(result);
		} finally {
			hide();
		}
	}

	function onDelete() {
		show({
			title: 'Confirm Deletion',
			description: ['Are you sure you want to delete this post?'],
			actions: [
				{
					label: 'Confirm & Delete',
					onPress: onDeleteConfirm,
				},
			],
		});
	}

	return (
		<>
			<BottomSheetMenu
				title={'Published'}
				variant={'raised'}
				menuItems={[
					{
						iconId: 'trash',
						onPress: onDelete,
						hidden: IsDeleted,
					},
					{
						iconId: 'eye-outline',
						onPress: () => {},
						hidden: IsDeleted,
					},
				]}
				CustomHeader={
					<View
						style={{
							flexDirection: 'row',
							flex: 1,
							alignItems: 'center',
						}}
					>
						<NativeTextBold
							style={{
								color: theme.secondary.a10,
								fontSize: 20,
								marginLeft: 4,
								flex: 1,
							}}
						>
							Post Published
						</NativeTextBold>
					</View>
				}
			/>
			<ScrollView contentContainerStyle={styles.scrollView}>
				{IsDeleted ? (
					<View
						style={[
							styles.deletionIndicator,
							{
								backgroundColor: theme.complementary,
							},
						]}
					>
						<NativeTextBold style={{ color: theme.primaryText }}>
							This post is now deleted.
						</NativeTextBold>
					</View>
				) : (
					<View />
				)}
				<TimelinePostItemView post={post} isPreview />
			</ScrollView>
		</>
	);
}

export default AuthoredPostPreviewBottomSheet;

const styles = StyleSheet.create({
	scrollView: { paddingHorizontal: 10, marginVertical: 32, paddingBottom: 52 },
	deletionIndicator: {
		padding: 12,
		borderRadius: 12,
		alignItems: 'center',
		paddingVertical: 16,
		marginBottom: 24,
	},
});
