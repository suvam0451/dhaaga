import ActivityPubClient, {
	GetPostsQueryDTO,
	GetUserPostsQueryDTO,
	RestClientCreateDTO,
	MediaUploadDTO,
	FollowPostDto,
} from '../_interface.js';
import { Note } from 'misskey-js/autogen/models.js';
import axios, { AxiosInstance } from 'axios';
import { Status, StatusArray } from '../../status/_interface.js';
import { MisskeyInstanceRouter } from './instance.js';
import { MisskeyAccountsRouter } from './accounts.js';
import { RestClient } from '@dhaaga/shared-provider-mastodon';
import { KNOWN_SOFTWARE } from '../_router/routes/instance.js';
import { MisskeyStatusesRouter } from './statuses.js';
import { MisskeyTrendsRouter } from './trends.js';
import { MisskeyNotificationsRouter } from './notifications.js';
import { MisskeyTimelinesRouter } from './timelines.js';
import { MisskeyTagsRouter } from './tags.js';
import { MisskeySearchRouter } from './search.js';
import { MisskeyMeRouter } from './me.js';
import { MisskeyMediaRouter } from './media.js';
import { MisskeyListsRoute } from './lists.js';

class MisskeyRestClient implements ActivityPubClient {
	client: RestClient;
	axiosClient: AxiosInstance;
	instances: MisskeyInstanceRouter;
	accounts: MisskeyAccountsRouter;
	statuses: MisskeyStatusesRouter;
	trends: MisskeyTrendsRouter;
	notifications: MisskeyNotificationsRouter;
	timelines: MisskeyTimelinesRouter;
	tags: MisskeyTagsRouter;
	search: MisskeySearchRouter;
	me: MisskeyMeRouter;
	media: MisskeyMediaRouter;
	lists: MisskeyListsRoute;

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
		this.trends = new MisskeyTrendsRouter(this.client);
		this.notifications = new MisskeyNotificationsRouter(this.client);
		this.timelines = new MisskeyTimelinesRouter(this.client);
		this.tags = new MisskeyTagsRouter(this.client);
		this.search = new MisskeySearchRouter(this.client);
		this.me = new MisskeyMeRouter(this.client);
		this.media = new MisskeyMediaRouter(this.client);
		this.lists = new MisskeyListsRoute(this.client);
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

	async muteUser(id: string): Promise<void> {
		// throw new Error("Method not implemented.");
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

	async getUserPosts(userId: string, opts: GetUserPostsQueryDTO) {
		return [];
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
