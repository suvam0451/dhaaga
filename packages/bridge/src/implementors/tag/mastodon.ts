import { MastodonTagInstance, TagTargetInterface } from './_interface.js';

class MastodonTag implements TagTargetInterface {
	ref: MastodonTagInstance;

	constructor(ref: MastodonTagInstance) {
		this.ref = ref;
	}

	isFollowing() {
		return this.ref.instance?.following;
	}

	getHistory() {
		return this.ref.instance?.history as any;
	}

	getName(): string {
		return this.ref.instance?.name;
	}

	getUrl(): string {
		return this.ref.instance?.url;
	}

	print(): void {
		console.log('[INFO]:', this.ref.instance);
	}
}

export default MastodonTag;
