import { TagTargetInterface } from './_interface.js';

export class DefaultTag implements TagTargetInterface {
	isFollowing(): boolean {
		throw new Error('Method not implemented.');
	}

	getHistory() {
		throw new Error('Method not implemented.');
	}

	getName(): string {
		throw new Error('Method not implemented.');
	}

	getUrl(): string {
		throw new Error('Method not implemented.');
	}

	print(): void {
		throw new Error('Method not implemented.');
	}
}

export default DefaultTag;
