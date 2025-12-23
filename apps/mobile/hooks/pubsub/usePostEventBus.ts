import { useEffect, useState } from 'react';
import { PostObjectType, PostViewer } from '@dhaaga/bridge';
import { useAppApiClient, useAppPublishers } from '#/states/global/hooks';
import { Emoji } from '#/components/dhaaga-bottom-sheet/modules/emoji-picker/emojiPickerReducer';
import { EmojiDto } from '#/components/common/status/fragments/_shared.types';
import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { LinkingUtils } from '#/utils/linking.utils';

/**
 * Registers and deregisters a post-object
 * on the event bus.
 *
 * NOTE: Only use this hook once per context or
 * isolated UI element, as it creates
 * copies of the post in memory (useState)
 *
 * @param input
 */
export function usePostEventBusStore(input: string | PostObjectType) {
	const { postEventBus } = useAppPublishers();
	const [Post, setPost] = useState<PostObjectType>(
		postEventBus.read(typeof input === 'string' ? input : null),
	);

	/**
	 * Subscribe to updates on the post-object
	 * via the event bus.
	 */
	useEffect(() => {
		if (!input) return;
		const uuid = typeof input === 'string' ? input : input?.uuid;
		if (!uuid) return;

		function update({ uuid }: { uuid: string }) {
			setPost(postEventBus.read(uuid));
		}

		if (typeof input !== 'string') {
			setPost(postEventBus.write(uuid, input));
		} else {
			update({ uuid });
		}
		postEventBus.subscribe(uuid, update);
		return () => {
			postEventBus.unsubscribe(uuid, update);
		};
	}, [input]);

	return { post: Post };
}

/**
 * Helps perform updates on a post
 * stored on the event bus. Any UI
 * components subscribed to that post-object using
 * usePostEventBusStore will receive an update
 *
 * @param input id of the post on the bus
 */
export function usePostEventBusActions(input: string) {
	const { client } = useAppApiClient();
	const { postEventBus } = useAppPublishers();

	async function toggleBookmark(loader?: (flag: boolean) => void) {
		await postEventBus.toggleBookmark(input, loader);
		Haptics.impactAsync(ImpactFeedbackStyle.Medium);
	}

	async function toggleLike(loader?: (flag: boolean) => void) {
		await postEventBus.toggleLike(input, loader);
		Haptics.impactAsync(ImpactFeedbackStyle.Medium);
	}

	async function loadBookmarkState(loader?: (flag: boolean) => void) {
		await postEventBus.loadBookmarkState(input, loader);
		Haptics.impactAsync(ImpactFeedbackStyle.Medium);
	}

	async function toggleShare(loader?: (flag: boolean) => void) {
		await postEventBus.toggleShare(input, loader);
		Haptics.impactAsync(ImpactFeedbackStyle.Medium);
	}

	async function addReaction(
		reaction: Emoji,
		loader?: (flag: boolean) => void,
	) {
		await postEventBus.addReaction(input, reaction, loader);
	}

	async function toggleReaction(
		reaction: EmojiDto,
		loader?: (flag: boolean) => void,
	) {
		await postEventBus.toggleReaction(input, reaction, loader);
	}

	async function shareLink() {
		console.log(
			PostViewer.generateShareableLink(client, postEventBus.read(input)),
		);
		LinkingUtils.shareUrl(
			PostViewer.generateShareableLink(client, postEventBus.read(input)),
		);
	}

	async function openInBrowser() {
		console.log(
			PostViewer.generateShareableLink(client, postEventBus.read(input)),
		);
		LinkingUtils.openURL(
			PostViewer.generateShareableLink(client, postEventBus.read(input)),
		);
	}

	return {
		toggleBookmark,
		toggleLike,
		loadBookmarkState,
		toggleShare,
		toggleReaction,
		addReaction,
		shareLink,
		openInBrowser,
	};
}
