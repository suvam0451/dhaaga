import { MisskeyTagInstance, TagTargetInterface } from './_interface.js';

class MisskeyTag implements TagTargetInterface {
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
		return this.ref.instance?.tag;
	}

	getUrl(): string | null | undefined {
		return '';
	}

	print(): void {
		console.log('[INFO]:', this.ref.instance);
	}

	getMentionedUsersCount(): number {
		return this.ref.instance?.mentionedUsersCount;
	}
}

export default MisskeyTag;
