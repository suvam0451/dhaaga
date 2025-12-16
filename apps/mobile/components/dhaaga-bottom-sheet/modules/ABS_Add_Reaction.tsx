import EmojiPickerBottomSheet from './emoji-picker/EmojiPickerBottomSheet';
import { Emoji } from './emoji-picker/emojiPickerReducer';
import { useAppBottomSheet } from '#/states/global/hooks';
import { useState } from 'react';
import { usePostEventBusActions } from '#/hooks/pubsub/usePostEventBus';

function ABS_Add_Reaction() {
	const { ctx, hide } = useAppBottomSheet();

	const { addReaction } = usePostEventBusActions(
		ctx.$type === 'post-id' ? ctx.postId : null,
	);
	const [IsLoading, setIsLoading] = useState(false);

	async function onAccept(o: Emoji) {
		await addReaction(o, setIsLoading);
		hide();
	}

	function onCancel() {
		console.log('cancelled');
	}

	return (
		<EmojiPickerBottomSheet
			onAccept={onAccept}
			onCancel={onCancel}
			isProcessing={IsLoading}
		/>
	);
}

export default ABS_Add_Reaction;
