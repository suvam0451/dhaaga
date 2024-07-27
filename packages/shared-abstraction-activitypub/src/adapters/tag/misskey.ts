import { MisskeyTagInstance, TagInterface } from './_interface.js';

class MisskeyTag implements TagInterface {
	ref: MisskeyTagInstance;

	constructor(ref: MisskeyTagInstance) {
		this.ref = ref;
	}

	isFollowing(): boolean | null | undefined {
		return false;
	}

	getHistory() {
		return [];
	}

	getName(): string | null | undefined {
		return this.ref.instance.tag;
	}

	getUrl(): string | null | undefined {
		return '';
	}

	print(): void {
		console.log('[INFO]:', this.ref.instance);
	}
}

export default MisskeyTag;
