import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Emoji } from './emoji-picker/emojiPickerReducer';
import MorePostActionsPresenter from '#/features/timelines/presenters/MorePostActionsPresenter';
import EmojiPickerBottomSheet from './emoji-picker/EmojiPickerBottomSheet';
import { ActivityPubReactionsService } from '@dhaaga/bridge';
import { useAppApiClient, useAppBottomSheet } from '#/states/global/hooks';
import { usePostEventBusStore } from '#/hooks/pubsub/usePostEventBusActions';
import { appDimensions } from '#/styles/dimensions';

function AppBottomSheetPostMoreActions() {
	const { ctx, stateId, hide } = useAppBottomSheet();
	const [EditMode, setEditMode] = useState<'root' | 'emoji'>('root');
	const { client, driver } = useAppApiClient();

	const { post } = usePostEventBusStore(
		ctx.$type === 'post-id' ? ctx.postId : null,
	);

	useEffect(() => {
		setEditMode('root');
	}, [stateId]);

	const [Loading, setLoading] = useState(false);

	async function onReactionRequested(emoji: Emoji) {
		const state = await ActivityPubReactionsService.addReaction(
			client,
			post.id,
			emoji.shortCode,
			driver,
			setLoading,
		);

		// request reducer to update reaction state
		if (!state) return;
		hide();
	}

	return (
		<View style={[styles.root]}>
			{EditMode === 'root' ? (
				<MorePostActionsPresenter item={post} setEditMode={setEditMode} />
			) : EditMode === 'emoji' ? (
				<EmojiPickerBottomSheet
					onAccept={onReactionRequested}
					onCancel={() => {
						setEditMode('root');
					}}
				/>
			) : (
				<View />
			)}
		</View>
	);
}

export default AppBottomSheetPostMoreActions;

const styles = StyleSheet.create({
	root: {
		padding: 8,
		borderTopLeftRadius: 32,
		borderTopRightRadius: 32,
		paddingTop: appDimensions.bottomSheet.clearanceTop,
	},
});
