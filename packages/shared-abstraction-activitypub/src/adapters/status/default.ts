import { UserType } from '../profile/_interface';
import {
	Status,
	StatusContextInstance,
	StatusContextInterface,
	StatusInterface,
} from './_interface';

class UnknownToStatusAdapter implements StatusInterface {
	getIsRebloggedByMe(): boolean | null | undefined {
		throw new Error('Method not implemented.');
	}

	getIsSensitive(): boolean {
		throw new Error('Method not implemented.');
	}

	getSpoilerText(): string | null | undefined {
		throw new Error('Method not implemented.');
	}

	getRaw(): Status {
		return null;
	}

	setDescendents(items: StatusInterface[]): void {
		throw new Error('Method not implemented.');
	}

	getDescendants(): StatusInterface[] {
		return [];
	}

	getUser(): UserType {
		throw new Error('Method not implemented.');
	}

	isReply(): boolean {
		return false;
	}

	getParentStatusId(): string {
		throw new Error('Method not implemented.');
	}

	getUserIdParentStatusUserId(): string {
		throw new Error('Method not implemented.');
	}

	getRepostedStatusRaw(): Status {
		return null;
	}

	getIsBookmarked() {
		return false;
	}

	getIsFavourited() {
		return false;
	}

	getRepliesCount(): number {
		return -1;
	}

	isValid() {
		return false;
	}

	getId(): string {
		return '';
	}

	getRepostsCount(): number {
		return -1;
	}

	getFavouritesCount(): number {
		return -1;
	}

	getUsername() {
		return '';
	}

	getDisplayName() {
		return '';
	}

	getAvatarUrl() {
		return '';
	}

	getCreatedAt() {
		return new Date().toString();
	}

	getVisibility() {
		return '';
	}

	getAccountUrl() {
		return '';
	}

	getRepostedStatus(): StatusInterface | null | undefined {
		return null;
	}

	isReposted() {
		return false;
	}

	getContent() {
		return '';
	}

	getMediaAttachments() {
		return [];
	}

	print() {
		console.log('Unknown status type');
	}

	getAccountId_Poster(): string {
		return '';
	}
}

export class UnknownToStatusContextAdapter implements StatusContextInterface {
	ref: StatusInterface;
	ctx: StatusContextInstance;

	constructor(ref: StatusInterface, ctx: StatusContextInstance) {
		this.ref = ref;
		this.ctx = ctx;
	}

	addChildren(items: StatusInterface[]): void {
		throw new Error('Method not implemented.');
	}

	getId(): string {
		throw new Error('Method not implemented.');
	}

	getChildren() {
		return [];
	}

	getParent() {
		return null;
	}

	getRoot() {
		return null;
	}
}

export default UnknownToStatusAdapter;
