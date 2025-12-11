import { useEffect, useState } from 'react';
import type { PostObjectType } from '@dhaaga/bridge';
import { useAppPublishers } from '#/states/global/hooks';
import { Emoji } from '#/components/dhaaga-bottom-sheet/modules/emoji-picker/emojiPickerReducer';
import { EmojiDto } from '#/components/common/status/fragments/_shared.types';

/**
 * Helps perform updates on a post
 * stored on the event bus. Also,
 * manages subscription and unsubscription.
 *
 * @param input pass the object directly for
 * timeline listings and use uuid for bottom
 * sheets, dialogs and such.
 */
export function usePostEventBusActions(input: string | PostObjectType) {
	const { postObjectActions } = useAppPublishers();
	const [Post, setPost] = useState<PostObjectType>(
		postObjectActions.read(typeof input === 'string' ? input : null),
	);

	/**
	 * Subscribe to updates on the post object
	 * via the event bus.
	 */
	useEffect(() => {
		const uuid = typeof input === 'string' ? input : input?.uuid;
		if (!uuid) return;

		function update({ uuid }: { uuid: string }) {
			setPost(postObjectActions.read(uuid));
		}
		update({ uuid });
		postObjectActions.subscribe(uuid, update);
		return () => {
			postObjectActions.unsubscribe(uuid, update);
		};
	}, [input]);

	function toggleBookmark(loader?: (flag: boolean) => void) {
		postObjectActions.toggleBookmark(Post?.uuid, loader);
	}

	function toggleLike(loader?: (flag: boolean) => void) {
		postObjectActions.toggleLike(Post?.uuid, loader);
	}

	function loadBookmarkState(loader?: (flag: boolean) => void) {
		postObjectActions.loadBookmarkState(Post?.uuid, loader);
	}

	function toggleShare(loader?: (flag: boolean) => void) {
		postObjectActions.toggleShare(Post?.uuid, loader);
	}

	function addReaction(reaction: Emoji, loader?: (flag: boolean) => void) {
		postObjectActions.addReaction(Post?.uuid, reaction, loader);
	}

	function toggleReaction(
		reaction: EmojiDto,
		loader?: (flag: boolean) => void,
	) {
		postObjectActions.toggleReaction(Post?.uuid, reaction, loader);
	}

	return {
		post: Post,
		toggleBookmark,
		toggleLike,
		loadBookmarkState,
		toggleShare,
		toggleReaction,
		addReaction,
	};
}
