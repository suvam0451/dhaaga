import ActivityPubClient, {
	FollowPostDto,
	GetPostsQueryDTO,
	TagArray,
} from '../_interface.js';
import { Status, StatusArray } from '../../status/_interface.js';
import { mastodon } from '@dhaaga/shared-provider-mastodon';
import type { Note } from 'misskey-js/autogen/models.js';
import { DefaultInstanceRouter } from './instance.js';
import { DefaultAccountRouter } from './accounts.js';
import { DefaultStatusesRouter } from './statuses.js';
import { DefaultBookmarksRouter } from './bookmarks.js';
import { DefaultTrendsRouter } from './trends.js';
import { DefaultNotificationsRouter } from './notifications.js';
import { DefaultTimelinesRouter } from './timelines.js';
import { DefaultTagRouter } from './tags.js';
import { DefaultSearchRouter } from './search.js';
import { DefaultMeRouter } from './me.js';

class UnknownRestClient implements ActivityPubClient {
	instances: DefaultInstanceRouter;
	accounts: DefaultAccountRouter;
	statuses: DefaultStatusesRouter;
	bookmarks: DefaultBookmarksRouter;
	trends: DefaultTrendsRouter;
	notifications: DefaultNotificationsRouter;
	timelines: DefaultTimelinesRouter;
	tags: DefaultTagRouter;
	search: DefaultSearchRouter;
	me: DefaultMeRouter;

	constructor() {
		this.instances = new DefaultInstanceRouter();
		this.accounts = new DefaultAccountRouter();
		this.statuses = new DefaultStatusesRouter();
		this.bookmarks = new DefaultBookmarksRouter();
		this.trends = new DefaultTrendsRouter();
		this.notifications = new DefaultNotificationsRouter();
		this.timelines = new DefaultTimelinesRouter();
		this.tags = new DefaultTagRouter();
		this.search = new DefaultSearchRouter();
		this.me = new DefaultMeRouter();
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

	async getMyFollowedTags() {
		return [];
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

	async muteUser(id: string) {
		return;
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

	async getUserProfile(username: string): Promise<mastodon.v1.Account> {
		throw new Error('Not Implemented');
	}

	async getStatus(id: string): Promise<Note> {
		throw new Error('Not Implemented');
	}
}

export default UnknownRestClient;
