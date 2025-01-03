import { TagInterface } from './_interface.js';

/**
 * In Bluesky, tags are simply string literals
 */
class BlueskyTag implements TagInterface {
	ref: string;
	domain: string;

	constructor(ref: string, domain: string) {
		this.ref = ref;
		this.domain = domain;
	}

	isFollowing() {
		return false;
	}

	getHistory() {
		return null;
	}

	getName(): string {
		return this.ref;
	}

	getUrl(): string {
		// TODO: refactor this to handle custom PDS
		return `https://bsky.app/hashtag/${this.ref.toUpperCase()}`;
	}

	print(): void {
		console.log('[INFO]:', this.ref);
	}
}

export default BlueskyTag;
