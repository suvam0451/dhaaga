import { BasePubSubService } from './_base.pubisher';
import { AppPostObject } from '../../types/app-post.types';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import ActivityPubClient from '@dhaaga/bridge/dist/adapters/_client/_interface';
import { PostMutator } from '../mutators/post.mutator';
import { Emoji } from '../../components/dhaaga-bottom-sheet/modules/emoji-picker/emojiPickerReducer';
import { EmojiDto } from '../../components/common/status/fragments/_shared.types';

export enum POST_EVENT_ENUM {
	UPDATE = 'postObjectChanged',
}

/**
 * Build this bad boi and pass it
 * around, when a post object needs
 * to be operated all way from Narnia
 */
export class PostPublisherService extends BasePubSubService {
	private readonly cache: Map<string, AppPostObject>;
	private readonly driver: KNOWN_SOFTWARE;
	private readonly client: ActivityPubClient;
	private readonly mutator: PostMutator;

	constructor(driver: KNOWN_SOFTWARE, client: ActivityPubClient) {
		super();
		this.driver = driver;
		this.client = client;
		this.cache = new Map();
		if (!this.client) {
			console.log('[WARN]: client empty');
		}
		this.mutator = new PostMutator(this.driver, this.client);
	}

	writeCache(uuid: string, data: AppPostObject) {
		this.cache.set(uuid, data);
	}

	readCache(uuid: string) {
		return this.cache.get(uuid);
	}

	addIfNotExist(uuid: string, data: AppPostObject) {
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

	private async _bind(
		uuid: string,
		fn: Function,
		loader?: (flag: boolean) => void,
	) {
		const data = this.cache.get(uuid);
		if (!data) return;
		if (loader) loader(true);
		const next = await fn.call(this.mutator, data);
		this.cache.set(next.uuid, next);
		this.publish(next.uuid);
		if (loader) loader(false);
	}

	async toggleLike(uuid: string, loader?: (flag: boolean) => void) {
		console.log(uuid);
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
