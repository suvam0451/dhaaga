import { EventBus, type PostObjectType } from '@dhaaga/bridge';
import { ApiTargetInterface } from '@dhaaga/bridge';
import type { FeedObjectType } from '@dhaaga/bridge';

export enum FEED_EVENT_ENUM {
	UPDATE = 'feedObjectChanged',
}

export class FeedPublisherService extends EventBus {
	private readonly cache: Map<string, FeedObjectType>;
	private readonly client: ApiTargetInterface;

	constructor(client: ApiTargetInterface) {
		super();
		this.client = client;
		this.cache = new Map();
		if (!this.client) {
			console.log('[WARN]: client empty');
		}
	}

	write(uuid: string, data: FeedObjectType) {
		this.cache.set(uuid, data);
		return this.cache.get(uuid);
	}

	read(uuid: string) {
		return this.cache.get(uuid);
	}

	// remove dead refs
	cleanup() {
		const activeKeys = new Set();

		// prune loose functions refs and event keys
		for (const uuid in this.subscriptions) {
			const refs = this.subscriptions[uuid];
			if (!refs) continue;

			// Remove dead callbacks from WeakRefs
			for (const ref of refs) {
				if (!ref.deref()) refs.delete(ref);
			}

			// If no subscribers remain, delete the event
			if (refs.size === 0) {
				delete this.subscriptions[uuid];
			} else {
				activeKeys.add(uuid);
			}
		}

		// Remove cached posts with no active subscribers
		for (const key of this.cache.keys()) {
			if (!activeKeys.has(key)) this.cache.delete(key);
		}
	}

	/**
	 * Log the number of items remaining and total subscription sizes
	 */
	private logStats(lastUuid: string) {
		const totalSubscriptions = Object.keys(this.subscriptions).reduce(
			(sum, key) => sum + (this.subscriptions[key]?.size || 0),
			0,
		);
		// console.log(
		// 	`[CLEANUP] Event "${lastUuid}" cleaned. Cache items: ${this.cache.size}, Total active subscriptions: ${totalSubscriptions}`,
		// );
	}

	/**
	 * Clean up dead refs for a single UUID
	 */
	cleanupEvent(uuid: string) {
		const refs = this.subscriptions[uuid];
		if (!refs) return;

		for (const ref of refs) {
			if (!ref.deref()) refs.delete(ref);
		}

		if (refs.size === 0) {
			delete this.subscriptions[uuid];
			this.cache.delete(uuid);
		}

		// --- Logging ---
		this.logStats(uuid);
	}

	publish(uuid: string) {
		super.publish(uuid); // call EventBus publish
		this.cleanupEvent(uuid); // clean only this uuid
		if (!this.subscriptions[uuid]) this.cache.delete(uuid);
	}

	private async _bind(
		uuid: string,
		fn: (
			client: ApiTargetInterface,
			input: PostObjectType,
		) => Promise<PostObjectType>,
		loader?: (flag: boolean) => void,
	) {
		const state = this.cache.get(uuid);
		if (!state) return;

		try {
			if (loader) loader(true);
			const next = await fn.call(null, this.client, state);
			this.cache.set(next.uuid, next);
			this.publish(next.uuid);
			if (loader) loader(false);
		} catch (e) {
			// console.log(e);
			if (loader) loader(false);
		}
	}
}
