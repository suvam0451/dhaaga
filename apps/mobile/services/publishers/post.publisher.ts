import { BasePubSubService } from './_base.pubisher';
import type { PostObjectType } from '@dhaaga/bridge';
import { KNOWN_SOFTWARE, ApiTargetInterface } from '@dhaaga/bridge';
import { Emoji } from '../../components/dhaaga-bottom-sheet/modules/emoji-picker/emojiPickerReducer';
import { EmojiDto } from '../../components/common/status/fragments/_shared.types';

class Mutator {
	private readonly client: ApiTargetInterface;

	constructor(client: ApiTargetInterface) {
		this.client = client;
	}

	async toggleLike(input: PostObjectType) {
		return this.client.post
			.toggleLike(input)
			.then((res) => res.unwrapOrElse(input));
	}

	async toggleBookmark(input: PostObjectType) {
		return this.client.post
			.toggleBookmark(input)
			.then((res) => res.unwrapOrElse(input));
	}

	async finalizeBookmarkState(input: PostObjectType): Promise<PostObjectType> {
		return this.client.post.loadBookmarkState(input);
	}

	async toggleShare(input: PostObjectType): Promise<PostObjectType> {
		return this.client.post.toggleShare(input);
	}

	async addReaction(
		input: PostObjectType,
		reactionCode: string,
	): Promise<PostObjectType> {
		return this.client.post
			.addReaction(input, reactionCode)
			.then((res) => res.unwrapOrElse(input));
	}

	async removeReaction(
		input: PostObjectType,
		reactionCode: string,
	): Promise<PostObjectType> {
		return this.client.post
			.removeReaction(input, reactionCode)
			.then((res) => res.unwrapOrElse(input));
	}
}

export enum POST_EVENT_ENUM {
	UPDATE = 'postObjectChanged',
}

/**
 * Responsible for mutating post objects,
 * as per requested operation and publishing
 * the updates to all subscribed data stores
 */
export class PostPublisherService extends BasePubSubService {
	private readonly cache: Map<string, PostObjectType>;
	private readonly driver: KNOWN_SOFTWARE;
	private readonly client: ApiTargetInterface;
	private readonly mutator: Mutator;

	constructor(driver: KNOWN_SOFTWARE, client: ApiTargetInterface) {
		super();
		this.driver = driver;
		this.client = client;
		this.cache = new Map();
		if (!this.client) {
			console.log('[WARN]: client empty');
		}
		this.mutator = new Mutator(this.client);
	}

	writeCache(uuid: string, data: PostObjectType) {
		this.cache.set(uuid, data);
	}

	readCache(uuid: string) {
		return this.cache.get(uuid);
	}

	addIfNotExist(uuid: string, data: PostObjectType) {
		if (!this.cache.get(uuid)) this.cache.set(uuid, data);
		return this.cache.get(uuid);
	}

	// remove dead refs
	cleanup() {
		const activeKeys = new Set();

		// prune loose functions refs and event keys
		for (const event in this.subscribers) {
			if (this.subscribers.hasOwnProperty(event)) {
				this.subscribers[event] = this.subscribers[event].filter(
					(subscriber: unknown) => typeof subscriber === 'function',
				);
				if (this.subscribers[event].length === 0) {
					delete this.subscribers[event];
				} else {
					activeKeys.add(event);
				}
			}
		}

		// prune orphan data
		// @ts-ignore-next-line
		for (let [key, value] of this.cache) {
			if (!activeKeys.has(key)) this.cache.delete(key);
		}
	}
	x;

	private async _bind(
		uuid: string,
		fn: Function,
		loader?: (flag: boolean) => void,
	) {
		const data = this.cache.get(uuid);
		if (!data) return;

		try {
			if (loader) loader(true);
			const next = await fn.call(this.mutator, data);
			this.cache.set(next.uuid, next);
			this.publish(next.uuid);
			if (loader) loader(false);
		} catch (e) {
			loader(false);
		}
	}

	async toggleLike(uuid: string, loader?: (flag: boolean) => void) {
		await this._bind(uuid, this.mutator.toggleLike, loader);
	}

	async toggleBookmark(uuid: string, loader?: (flag: boolean) => void) {
		await this._bind(uuid, this.mutator.toggleBookmark, loader);
	}

	async finalizeBookmarkState(uuid: string, loader?: (flag: boolean) => void) {
		await this._bind(uuid, this.mutator.finalizeBookmarkState, loader);
	}

	async toggleShare(uuid: string, loader?: (flag: boolean) => void) {
		await this._bind(uuid, this.mutator.toggleShare, loader);
	}

	async addReaction(
		uuid: string,
		reaction: Emoji,
		loader?: (flag: boolean) => void,
	) {
		const data = this.cache.get(uuid);
		if (!data) return;
		if (loader) loader(true);
		const next = await this.mutator.addReaction(data, reaction.shortCode);
		this.cache.set(next.uuid, next);
		this.publish(next.uuid);
		if (loader) loader(false);
	}

	async toggleReaction(
		uuid: string,
		reaction: EmojiDto,
		loader?: (flag: boolean) => void,
	) {
		const data = this.cache.get(uuid);
		if (!data) return;
		const next = reaction.me
			? await this.mutator.removeReaction(data, reaction.name)
			: await this.mutator.addReaction(data, reaction.name);
		this.cache.set(next.uuid, next);
		this.publish(next.uuid);
		if (loader) loader(false);
	}
}
