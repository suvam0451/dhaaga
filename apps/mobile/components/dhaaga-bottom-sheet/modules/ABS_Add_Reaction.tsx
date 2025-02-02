import EmojiPickerBottomSheet from './emoji-picker/EmojiPickerBottomSheet';
import { Emoji } from './emoji-picker/emojiPickerReducer';
import {
	useAppBottomSheet,
	useAppPublishers,
} from '../../../hooks/utility/global-state-extractors';
import { useEffect, useState } from 'react';

function ABS_Add_Reaction() {
	const { ctx, hide } = useAppBottomSheet();
	const { postPub } = useAppPublishers();
	const [Post, setPost] = useState(postPub.readCache(ctx?.uuid));

	const [IsLoading, setIsLoading] = useState(false);

	function refreshData({ uuid }: { uuid: string }) {
		setPost(postPub.readCache(uuid));
	}

	useEffect(() => {
		refreshData({ uuid: ctx?.uuid });
		postPub.subscribe(ctx?.uuid, refreshData);
		return () => {
			postPub.unsubscribe(ctx?.uuid, refreshData);
		};
	}, [ctx]);

	function onAccept(o: Emoji) {
		postPub.addReaction(Post?.uuid, o, setIsLoading).finally(() => {
			hide();
		});
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
