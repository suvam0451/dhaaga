/**
 * When multiple UI components need
 * to listen to status updates in a
 * post/user/tag, hook it to a PubSub
 * instance and let any of them call
 * the update functions
 */
class EventBus {
	/**
	 * A map of items and the functions originating
	 * from UI elements that are subscribed to any
	 * changes to the item.
	 * @protected
	 */
	protected readonly subscriptions: Record<string, Set<WeakRef<Function>>> = {};
	/**
	 * A map of UI elements and the item list they
	 * are subscribed to
	 * @protected
	 */
	protected readonly subscribers: Record<string, string[]> = {};

	// remove dead refs
	cleanup() {
		for (const event in this.subscriptions) {
			const refs = this.subscriptions[event];
			const cleaned = new Set<WeakRef<Function>>();

			for (const ref of refs) {
				if (ref.deref()) {
					cleaned.add(ref);
				}
			}

			this.subscriptions[event] = cleaned;
		}
	}

	/**
	 * Removes dead refs from the event subscriptions
	 * @param event
	 * @private
	 */
	cleanupEvent(event: string) {
		const refs = this.subscriptions[event];
		if (!refs) return;

		for (const ref of refs) {
			if (!ref.deref()) {
				refs.delete(ref);
			}
		}

		if (refs.size === 0) delete this.subscriptions[event];
	}

	/**
	 *
	 * @param uuid
	 * @param callback
	 */
	subscribe(uuid: string, callback: Function) {
		let refs = this.subscriptions[uuid];
		if (!refs) refs = this.subscriptions[uuid] = new Set();
		refs.add(new WeakRef(callback));
		this.cleanupEvent(uuid);
	}

	unsubscribe(uuid: string, callback: Function) {
		const refs = this.subscriptions[uuid];
		if (!refs) return;
		for (const ref of refs) {
			if (ref.deref() === callback) {
				refs.delete(ref);
			}
		}
		if (refs.size === 0) delete this.subscriptions[uuid];
	}

	/**
	 * releases memory of objects that are not being
	 * referenced by any UI element
	 */
	prune() {
		for (const event in this.subscriptions) {
			if (this.subscriptions[event].size === 0) {
				delete this.subscriptions[event];
			}
		}
	}

	// Publish an event with optional data to notify subscribers
	publish(uuid: string) {
		const refs = this.subscriptions[uuid];
		if (!refs) return;

		for (const ref of refs) {
			const callback = ref.deref();
			if (callback) callback({ uuid });
		}

		// Remove any dead refs created during deref
		this.cleanupEvent(uuid);
	}
}

export { EventBus };
