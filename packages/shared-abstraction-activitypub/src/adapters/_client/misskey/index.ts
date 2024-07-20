import ActivityPubClient, {
	GetSearchResultQueryDTO,
	GetPostsQueryDTO,
	GetUserPostsQueryDTO,
	RestClientCreateDTO,
	MediaUploadDTO,
	GetTimelineQueryDTO,
	FollowPostDto,
} from '../_interface.js';
import { Note } from 'misskey-js/autogen/models.js';
import axios, { AxiosInstance } from 'axios';
import { Status, StatusArray } from '../../status/_interface.js';
import { MisskeyInstanceRouter } from './instance.js';
import { MisskeyAccountsRouter } from './accounts.js';
import { RestClient } from '@dhaaga/shared-provider-mastodon';
import { KNOWN_SOFTWARE } from '../_router/instance.js';
import { MisskeyStatusesRouter } from './statuses.js';
import { MisskeyBookmarksRouter } from './bookmarks.js';
import { MisskeyTrendsRouter } from './trends.js';
import { MisskeyNotificationsRouter } from './notifications.js';

class MisskeyRestClient implements ActivityPubClient {
	client: RestClient;
	axiosClient: AxiosInstance;
	instances: MisskeyInstanceRouter;
	accounts: MisskeyAccountsRouter;
	statuses: MisskeyStatusesRouter;
	bookmarks: MisskeyBookmarksRouter;
	trends: MisskeyTrendsRouter;
	notifications: MisskeyNotificationsRouter;

	constructor(dto: RestClientCreateDTO) {
		this.client = new RestClient(dto.instance, {
			accessToken: dto.token,
			domain: KNOWN_SOFTWARE.MISSKEY,
		});
		this.axiosClient = axios.create({
			baseURL: `${dto.instance}/api`,
		});
		this.instances = new MisskeyInstanceRouter();
		this.accounts = new MisskeyAccountsRouter(this.client);
		this.statuses = new MisskeyStatusesRouter(this.client);
		this.bookmarks = new MisskeyBookmarksRouter(this.client);
		this.trends = new MisskeyTrendsRouter(this.client);
		this.notifications = new MisskeyNotificationsRouter(this.client);
	}

	async reblog(id: string): Promise<Status> {
		throw new Error('Method not implemented.');
	}

	async undoReblog(id: string): Promise<Status> {
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

	getPublicTimeline(
		opts?: GetTimelineQueryDTO | undefined,
	): Promise<StatusArray> {
		throw new Error('Method not implemented.');
	}

	getPublicTimelineAsGuest(
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

	uploadMedia(params: MediaUploadDTO): Promise<any> {
		throw new Error('Method not implemented.');
	}

	async getFollowing(id: string) {
		return [];
	}

	async getFollowers(id: string) {
		return [];
	}

	async getMe() {
		return null;
	}

	async getMyConversations() {
		return [];
	}

	getStatusContext(id: string): Promise<any> {
		throw new Error('Method not implemented.');
	}

	async getRelationshipWith(ids: string[]) {
		return [];
	}

	async getTrendingPosts() {
		return [];
	}

	async getTrendingTags() {
		return [];
	}

	async getTrendingLinks() {
		return [];
	}

	async followTag(id: string) {
		return null;
	}

	async unfollowTag(id: string) {
		return null;
	}

	async getTag(id: string) {
		return null;
	}

	async muteUser(id: string): Promise<void> {
		// throw new Error("Method not implemented.");
	}

	async search(q: string, dto: GetSearchResultQueryDTO): Promise<any> {
		return [];
	}

	async getFavourites(opts: GetPostsQueryDTO): Promise<StatusArray> {
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

	async bookmark(id: string): Promise<Note> {
		throw new Error('Method not implemented.');
	}

	async unBookmark(id: string): Promise<Note> {
		throw new Error('Method not implemented.');
	}

	async getUserPosts(userId: string, opts: GetUserPostsQueryDTO) {
		// throw new Error('Method not implemented.');

		return [];
		// return this.client.request('users/notes', {
		// 	userId: userId,
		// 	limit: opts.limit,
		// });
	}

	async getHomeTimeline(): Promise<Note[]> {
		// return await this.client.request('notes/local-timeline', { limit: 20 });
		return [];
	}

	async getTimelineByHashtag(q: string): Promise<Note[]> {
		const res = await this.axiosClient.post<Note[]>('/notes/search-by-tag', {
			limit: 20,
			tag: q,
		});
		return res.data;
	}

	async getUserProfile(username: string) {
		// return this.client.request('users/show', { username });
		return [] as any;
	}

	async getStatus(id: string): Promise<Note> {
		throw new Error('Not Implemented');
	}
}

export default MisskeyRestClient;
