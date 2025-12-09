import EmojiPickerBottomSheet from './emoji-picker/EmojiPickerBottomSheet';
import { Emoji } from './emoji-picker/emojiPickerReducer';
import {
	useAppBottomSheet,
	useAppPublishers,
} from '#/hooks/utility/global-state-extractors';
import { useEffect, useState } from 'react';

function ABS_Add_Reaction() {
	const { ctx, hide } = useAppBottomSheet();
	const { postObjectActions } = useAppPublishers();
	const [Post, setPost] = useState(null);

	const [IsLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!ctx?.uuid) return;
		function load({ uuid }: { uuid: string }) {
			setPost(postObjectActions.read(uuid));
		}
		load(ctx?.uuid);
		postObjectActions.subscribe(ctx?.uuid, load);
		return () => {
			postObjectActions.unsubscribe(ctx?.uuid, load);
		};
	}, [ctx?.uuid]);

	async function onAccept(o: Emoji) {
		await postObjectActions.addReaction(Post?.uuid, o, setIsLoading);
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
