import { useEffect, useState } from 'react';
import type { PostObjectType } from '@dhaaga/core';
import { useAppPublishers } from '../../../hooks/utility/global-state-extractors';
import { Emoji } from '../../../components/dhaaga-bottom-sheet/modules/emoji-picker/emojiPickerReducer';
import { EmojiDto } from '../../../components/common/status/fragments/_shared.types';

/**
 * Perform updates on a post object
 * (or referenced by id)
 * from central registry
 *
 * @param input post object or uuid reference
 */
export function usePostInteractor(input: string | PostObjectType) {
	const { postPub } = useAppPublishers();
	const [PostObject, setPostObject] = useState<PostObjectType>(
		postPub.readCache(typeof input === 'string' ? input : null),
	);

	function onUpdate({ uuid }: { uuid: string }) {
		setPostObject(postPub.readCache(uuid));
	}

	useEffect(() => {
		if (typeof input === 'string') {
			onUpdate({ uuid: input });
			postPub.subscribe(input, onUpdate);
			return () => {
				postPub.unsubscribe(input, onUpdate);
			};
		} else {
			if (!input) {
				postPub.unsubscribe(input?.uuid, onUpdate);
				return;
			}
			onUpdate({ uuid: input?.uuid });
			postPub.subscribe(input?.uuid, onUpdate);
			return () => {
				postPub.unsubscribe(input?.uuid, onUpdate);
			};
		}
	}, [input]);

	function toggleBookmark(loader?: (flag: boolean) => void) {
		postPub.toggleBookmark(PostObject?.uuid, loader);
	}

	function toggleLike(loader?: (flag: boolean) => void) {
		postPub.toggleLike(PostObject?.uuid, loader);
	}

	function finalizeBookmarkState(loader?: (flag: boolean) => void) {
		postPub.finalizeBookmarkState(PostObject?.uuid, loader);
	}

	function toggleShare(loader?: (flag: boolean) => void) {
		postPub.toggleShare(PostObject?.uuid, loader);
	}

	function addReaction(reaction: Emoji, loader?: (flag: boolean) => void) {
		postPub.addReaction(PostObject?.uuid, reaction, loader);
	}

	function toggleReaction(
		reaction: EmojiDto,
		loader?: (flag: boolean) => void,
	) {
		postPub.toggleReaction(PostObject?.uuid, reaction, loader);
	}

	return {
		post: PostObject,
		toggleBookmark,
		toggleLike,
		finalizeBookmarkState,
		toggleShare,
		toggleReaction,
		addReaction,
	};
}
