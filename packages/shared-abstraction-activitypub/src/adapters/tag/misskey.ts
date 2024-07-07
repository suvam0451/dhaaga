import { MisskeyTagInstance, TagInterface } from './_interface.js';

class MisskeyTag implements TagInterface {
	ref: MisskeyTagInstance;

	constructor(ref: MisskeyTagInstance) {
		this.ref = ref;
	}

	isFollowing(): boolean | null | undefined {
		throw new Error('Method not implemented.');
	}

	getHistory() {
		throw new Error('Method not implemented.');
	}

	getName(): string | null | undefined {
		throw new Error('Method not implemented.');
	}

	getUrl(): string | null | undefined {
		throw new Error('Method not implemented.');
	}

	print(): void {
		throw new Error('Method not implemented.');
	}
}

export default MisskeyTag;
