import { BasePubSubService } from './_base.pubisher';
import { AppPostObject } from '../../types/app-post.types';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';
import ActivityPubClient from '@dhaaga/shared-abstraction-activitypub/dist/adapters/_client/_interface';
import { PostMutatorService } from '../post-mutator.service';

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
	private readonly mutator: PostMutatorService;

	constructor(driver: KNOWN_SOFTWARE, client: ActivityPubClient) {
		super();
		this.driver = driver;
		this.client = client;
		this.cache = new Map();
		if (!this.client) {
			console.log('[WARN]: client empty');
		}
		this.mutator = new PostMutatorService(this.driver, this.client);
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
}
