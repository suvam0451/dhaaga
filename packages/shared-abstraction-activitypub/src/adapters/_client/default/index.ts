import ActivityPubClient, {
	FollowPostDto,
	GetPostsQueryDTO,
	GetSearchResultQueryDTO,
	GetTimelineQueryDTO,
	TagArray,
} from '../_interface.js';
import { Status, StatusArray } from '../../status/_interface.js';
import { mastodon } from '@dhaaga/shared-provider-mastodon';
import type { Note } from 'misskey-js/autogen/models.js';
import { DefaultInstanceRouter } from './instance.js';
import { DefaultAccountsRouter } from './accounts.js';
import { DefaultStatusesRouter } from './statuses.js';
import { DefaultBookmarksRouter } from './bookmarks.js';
import { DefaultTrendsRouter } from './trends.js';

class UnknownRestClient implements ActivityPubClient {
	instances: DefaultInstanceRouter;
	accounts: DefaultAccountsRouter;
	statuses: DefaultStatusesRouter;
	bookmarks: DefaultBookmarksRouter;
	trends: DefaultTrendsRouter;

	constructor() {
		this.instances = new DefaultInstanceRouter();
		this.accounts = new DefaultAccountsRouter();
		this.statuses = new DefaultStatusesRouter();
		this.bookmarks = new DefaultBookmarksRouter();
		this.trends = new DefaultTrendsRouter();
	}

	reblog(id: string): Promise<Status> {
		throw new Error('Method not implemented.');
	}

	undoReblog(id: string): Promise<Status> {
		throw new Error('Method not implemented.');
	}

	async getMyLists() {
		return [];
	}

	followUser(id: string, opts: FollowPostDto): Promise<any> {
		throw new Error('Method not implemented.');
	}

	unfollowUser(id: string): Promise<any> {
		throw new Error('Method not implemented.');
	}

	getListTimeline(
		q: string,
		opts?: GetPostsQueryDTO | undefined,
	): Promise<StatusArray> {
		throw new Error('Method not implemented.');
	}

	getLocalTimeline(
		opts?: GetTimelineQueryDTO | undefined,
	): Promise<StatusArray> {
		throw new Error('Method not implemented.');
	}

	async getMyFollowedTags() {
		return [];
	}

	getPublicTimelineAsGuest(
		opts?: GetTimelineQueryDTO | undefined,
	): Promise<StatusArray> {
		throw new Error('Method not implemented.');
	}

	getPublicTimeline(
		opts?: GetTimelineQueryDTO | undefined,
	): Promise<StatusArray> {
		throw new Error('Method not implemented.');
	}

	getIsSensitive(): boolean {
		throw new Error('Method not implemented.');
	}

	getSpoilerText(): string | null {
		throw new Error('Method not implemented.');
	}

	uploadMedia(): Promise<any> {
		throw new Error('Method not implemented.');
	}

	getFollowing(id: string): Promise<any[] | mastodon.v1.Account[]> {
		throw new Error('Method not implemented.');
	}

	getFollowers(id: string): Promise<any[] | mastodon.v1.Account[]> {
		throw new Error('Method not implemented.');
	}

	async getMyConversations() {
		return [];
	}

	async getMe() {
		return null;
	}

	getStatusContext(id: string): Promise<any> {
		throw new Error('Method not implemented.');
	}

	async getRelationshipWith(ids: string[]) {
		return [];
	}

	getTrendingPosts(opts: GetPostsQueryDTO): Promise<StatusArray> {
		throw new Error('Method not implemented.');
	}

	getTrendingTags(): Promise<TagArray> {
		throw new Error('Method not implemented.');
	}

	getTrendingLinks(): Promise<any[]> {
		throw new Error('Method not implemented.');
	}

	async followTag(id: string) {
		return null;
	}

	async unfollowTag(id: string) {
		return null;
	}

	async getTag() {
		return null;
	}

	async muteUser(id: string) {
		return;
	}

	async search(q: string, dto: GetSearchResultQueryDTO): Promise<any> {
		return [];
	}

	async getFavourites(opts: GetPostsQueryDTO) {
		return [];
	}

	async getBookmarks(opts: GetPostsQueryDTO) {
		return { data: [] };
	}

	async getFollowedTags() {
		return [];
	}

	async favourite(id: string) {
		return null;
	}

	async unFavourite(id: string) {
		return null;
	}

	getUserPosts(): Promise<Note[] | mastodon.v1.Status[]> {
		throw new Error('Method not implemented.');
	}

	async bookmark(id: string): Promise<Note> {
		throw new Error('Method not implemented.');
	}

	async unBookmark(id: string): Promise<Note> {
		throw new Error('Method not implemented.');
	}

	async getHomeTimeline() {
		return [];
	}

	async getTimelineByHashtag(q: string) {
		return [];
	}

	async getUserProfile(username: string): Promise<mastodon.v1.Account> {
		throw new Error('Not Implemented');
	}

	async getStatus(id: string): Promise<Note> {
		throw new Error('Not Implemented');
	}
}

export default UnknownRestClient;
