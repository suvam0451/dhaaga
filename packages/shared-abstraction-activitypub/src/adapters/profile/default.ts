import { UserInterface } from './_interface.js';

export class DefaultUser implements UserInterface {
	getInstanceUrl(): string {
		return '';
	}

	getIsLockedProfile(): boolean | null | undefined {
		return false;
	}

	getAccountUrl(): string {
		return '';
	}

	getAppDisplayAccountUrl(myDomain: string): string {
		return '';
	}

	getEmojiMap() {
		return new Map();
	}

	findEmoji(q: string) {
		return undefined;
	}

	getAvatarBlurHash(): string {
		return '';
	}

	getAvatarUrl(): string {
		return '';
	}

	getBannerUrl(): string | null {
		return '';
	}

	getBannerBlurHash(): string | null {
		return '';
	}

	getDescription(): string | null {
		return '';
	}

	getCreatedAt(): Date {
		throw new Error('Method not implemented.');
	}

	getBirthday(): Date | null {
		throw new Error('Method not implemented.');
	}

	getFields() {
		return [];
	}

	getFollowersCount(): number {
		return 0;
	}

	getFollowingCount(): number {
		return 0;
	}

	hasPendingFollowRequestFromYou(): boolean | null {
		return false;
	}

	hasPendingFollowRequestToYou(): boolean | null {
		return false;
	}

	getId(): string {
		return '';
	}

	getIsBot(): boolean {
		return false;
	}

	getDisplayName(): string | null {
		return '';
	}

	getPostCount(): number {
		return 0;
	}

	getUsername(): string {
		return '';
	}

	getOnlineStatus(): 'unknown' | 'online' | 'active' | 'offline' {
		return 'unknown';
	}
}

export default DefaultUser;
