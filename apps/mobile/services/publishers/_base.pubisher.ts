/**
 * When multiple UI components need
 * to listen to status updates in a
 * post/user/tag, hook it to a PubSub
 * instance and let any of them call
 * the update functions
 */
export class BasePubSubService {
	protected readonly subscribers: Map<string, Function[]>;

	constructor() {
		this.subscribers = new Map<string, Function[]>();
	}

	// remove dead refs
	cleanup() {
		for (const event in this.subscribers) {
			if (this.subscribers.hasOwnProperty(event)) {
				this.subscribers[event] = this.subscribers[event].filter(
					(subscriber: unknown) => typeof subscriber === 'function',
				);
			}
		}
	}

	subscribe(event: string, callback: Function) {
		if (!this.subscribers[event]) this.subscribers[event] = [];

		this.subscribers[event].push(callback);

		this.cleanup();
	}

	// Unsubscribe from a specific event (optional)
	unsubscribe(event: string, callback: Function) {
		if (!this.subscribers[event]) return;

		this.subscribers[event] = this.subscribers[event].filter(
			(subscriber: unknown) => subscriber !== callback,
		);
	}

	// Publish an event with optional data to notify subscribers
	publish(uuid: string) {
		if (!this.subscribers[uuid]) return;

		this.cleanup();
		if (this.subscribers[uuid].length > 8) {
			console.log('[WARN]: too many subscribers. potential memory leak');
		}

		this.subscribers[uuid].forEach((callback: Function) => {
			callback.call(null, { uuid });
		});
	}
}
