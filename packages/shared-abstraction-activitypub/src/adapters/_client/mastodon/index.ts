import ActivityPubClient, {
	FollowPostDto,
	GetPostsQueryDTO,
	GetSearchResultQueryDTO,
	GetTimelineQueryDTO,
	GetTrendingPostsQueryDTO,
	GetUserPostsQueryDTO,
	HashtagTimelineQuery,
	MastoAccountCredentials,
	MastoContext,
	MastoConversation,
	MastoList,
	MastoRelationship,
	MastoStatus,
	MastoTrendLink,
	MediaUploadDTO,
	RestClientCreateDTO,
} from '../_interface.js';
import type { mastodon } from 'masto';
import { RestClient, RestServices } from '@dhaaga/shared-provider-mastodon';
import { StatusArray } from '../../status/_interface.js';
import { createRestAPIClient } from 'masto';
import { Note } from 'misskey-js/autogen/models.js';
import { MastodonInstanceRouter } from './instance.js';
import { MastodonAccountsRouter } from './accounts.js';
import { KNOWN_SOFTWARE } from '../_router/instance.js';
import { MastodonStatusesRouter } from './statuses.js';
import { MastodonBookmarksRouter } from './bookmarks.js';
import { MastodonTrendsRouter } from './trends.js';

class MastodonRestClient implements ActivityPubClient {
	client: RestClient;
	instances: MastodonInstanceRouter;
	accounts: MastodonAccountsRouter;
	statuses: MastodonStatusesRouter;
	bookmarks: MastodonBookmarksRouter;
	trends: MastodonTrendsRouter;

	constructor(dto: RestClientCreateDTO) {
		this.client = new RestClient(dto.instance, {
			accessToken: dto.token,
			domain: KNOWN_SOFTWARE.MASTODON,
		});
		this.instances = new MastodonInstanceRouter(this.client);
		this.accounts = new MastodonAccountsRouter(this.client);
		this.statuses = new MastodonStatusesRouter(this.client);
		this.bookmarks = new MastodonBookmarksRouter(this.client);
		this.trends = new MastodonTrendsRouter(this.client);
	}

	async reblog(id: string): Promise<MastoStatus | null> {
		const _client = this.createMastoClient();
		try {
			return _client.v1.statuses.$select(id).reblog();
		} catch (e) {
			console.log(e);
			return null;
		}
	}

	async undoReblog(id: string): Promise<MastoStatus | null> {
		const _client = this.createMastoClient();
		try {
			return _client.v1.statuses.$select(id).unreblog();
		} catch (e) {
			console.log(e);
			return null;
		}
	}

	async getMyLists(): Promise<MastoList[]> {
		const _client = this.createMastoClient();
		try {
			return await _client.v1.lists.list();
		} catch (e) {
			console.log(e);
			return [];
		}
	}

	async followUser(id: string, opts: FollowPostDto): Promise<any> {
		const _client = this.createMastoClient();
		try {
			return await _client.v1.accounts.$select(id).follow(opts);
		} catch (e) {
			console.log(e);
			return [];
		}
	}

	async unfollowUser(id: string): Promise<any> {
		const _client = this.createMastoClient();
		try {
			return await _client.v1.accounts.$select(id).unfollow();
		} catch (e) {
			console.log(e);
			return [];
		}
	}

	async getListTimeline(
		q: string,
		opts?: GetPostsQueryDTO | undefined,
	): Promise<StatusArray> {
		const _client = this.createMastoClient();
		try {
			console.log(q);
			return await _client.v1.timelines.list.$select(q).list(opts);
		} catch (e) {
			console.log(e);
			return [];
		}
	}

	async getLocalTimeline(
		opts?: GetTimelineQueryDTO | undefined,
	): Promise<StatusArray> {
		const _client = this.createMastoClient();
		try {
			return await _client.v1.timelines.public.list(opts);
		} catch (e) {
			console.log(e);
			return [];
		}
	}

	// async getMyFollowedTags(opts: GetPostsQueryDTO): Promise<mastodon.v1.Tag[]> {
	//     return await RestServices.v1.accounts.ts.getFollowedTags(this.client, opts);
	// }

	async getPublicTimelineAsGuest(
		opts?: GetTimelineQueryDTO | undefined,
	): Promise<StatusArray> {
		const _client = this.createPublicClient();
		try {
			return await _client.v1.timelines.public.list(opts);
		} catch (e) {
			console.log(e);
			return [];
		}
	}

	async getPublicTimeline(
		opts?: GetTimelineQueryDTO | undefined,
	): Promise<StatusArray> {
		const _client = this.createMastoClient();
		try {
			return await _client.v1.timelines.public.list(opts);
		} catch (e) {
			console.log(e);
			return [];
		}
	}

	getIsSensitive(): boolean {
		throw new Error('Method not implemented.');
	}

	getSpoilerText(): string | null {
		throw new Error('Method not implemented.');
	}

	async uploadMedia(params: MediaUploadDTO): Promise<any> {
		const _client = this.createMastoClient();
		try {
			return await _client.v2.media.create(params);
		} catch (e) {
			console.log(e);
			return null;
		}
	}

	async getFollowing(id: string) {
		const _client = this.createMastoClient();
		try {
			return await _client.v1.accounts.$select(id).following.list();
		} catch (e) {
			console.log(e);
			return null;
		}
	}

	async getFollowers(id: string) {
		const _client = this.createMastoClient();
		try {
			return await _client.v1.accounts.$select(id).followers.list();
		} catch (e) {
			console.log(e);
			return null;
		}
	}

	async getMe(): Promise<MastoAccountCredentials | null> {
		const _client = this.createMastoClient();
		try {
			return await _client.v1.accounts.verifyCredentials();
		} catch (e) {
			console.log('[ERROR]: fetching account info', e);
			return null;
		}
	}

	async getMyConversations(): Promise<MastoConversation[]> {
		const _client = this.createMastoClient();
		try {
			return await _client.v1.conversations.list();
		} catch (e) {
			console.log(e);
			return [];
		}
	}

	async getStatusContext(id: string): Promise<MastoContext | null> {
		const _client = this.createMastoClient();
		try {
			return await _client.v1.statuses.$select(id).context.fetch();
		} catch (e) {
			console.log(e);
			return null;
		}
	}

	async getRelationshipWith(ids: string[]): Promise<MastoRelationship[]> {
		const _client = this.createMastoClient();
		try {
			return await _client.v1.accounts.relationships.fetch({ id: ids });
		} catch (e) {
			console.log(e);
			return [];
		}
	}

	async getTrendingPosts(
		opts: GetTrendingPostsQueryDTO,
	): Promise<MastoStatus[]> {
		return await RestServices.v1.trends.getTrendingPosts(this.client, opts);
	}

	async getTrendingTags(opts: GetTrendingPostsQueryDTO) {
		return await RestServices.v1.trends.getTrendingTags(this.client, opts);
	}

	async getTrendingLinks(
		opts: GetTrendingPostsQueryDTO,
	): Promise<MastoTrendLink[]> {
		return await RestServices.v1.trends.getTrendingLinks(this.client, opts);
	}

	async followTag(id: string) {
		const _client = this.createMastoClient();
		try {
			return await _client.v1.tags.$select(id).follow();
		} catch (e) {
			console.log(e);
			return null;
		}
	}

	async unfollowTag(id: string) {
		const _client = this.createMastoClient();
		try {
			return await _client.v1.tags.$select(id).unfollow();
		} catch (e) {
			console.log(e);
			return null;
		}
	}

	async getTag(id: string) {
		const _client = this.createPublicClient();
		try {
			console.log('started fetching tag', id, _client);
			const data = await _client.v1.tags.$select(id).fetch();
			console.log(data);
			return data;
		} catch (e) {
			console.log(e);
			return null;
		}
	}

	async muteUser(id: string) {
		const _client = this.createMastoClient();
		try {
			await _client.v1.accounts.$select(id).mute();
			return;
		} catch (e) {
			console.log(e);
			return;
		}
	}

	async search(q: string, dto: GetSearchResultQueryDTO): Promise<any> {
		const _client = this.createMastoClient();
		try {
			return await _client.v2.search.list({
				q,
				type: dto.type,
				following: dto.following,
				limit: dto.limit,
				maxId: dto.maxId,
			});
		} catch (e) {
			console.log(e);
			return [];
		}
	}

	createClient() {
		return createRestAPIClient({
			url: `https://${this.client.url}`,
			accessToken: this.client.accessToken,
		});
	}

	createPublicClient() {
		return createRestAPIClient({
			url: `https://${this.client.url}`,
		});
	}

	async getFavourites(opts: GetPostsQueryDTO): Promise<StatusArray> {
		const _client = this.createMastoClient();
		try {
			return await _client.v1.favourites.list();
		} catch (e) {
			console.log(e);
			return [];
		}
	}

	async getBookmarks(opts: GetPostsQueryDTO): Promise<{
		data: MastoStatus[];
		minId?: string | undefined;
		maxId?: string | undefined;
	}> {
		return await RestServices.v1.bookmarks.getBookmarks(this.client, opts);
	}

	async getFollowedTags(opts: GetPostsQueryDTO) {
		return await RestServices.v1.accounts.getFollowedTags(this.client, opts);
	}

	async favourite(id: string): Promise<MastoStatus | null> {
		const _client = this.createMastoClient();
		try {
			return await _client.v1.statuses.$select(id.toString()).favourite();
		} catch (e) {
			console.log(e);
			return null;
		}
	}

	async unFavourite(id: string): Promise<MastoStatus | null> {
		const _client = this.createMastoClient();
		try {
			return await _client.v1.statuses.$select(id.toString()).unfavourite();
		} catch (e) {
			console.log(e);
			return null;
		}
	}

	async getUserPosts(
		userId: string,
		opts: GetUserPostsQueryDTO,
	): Promise<Note[] | mastodon.v1.Status[]> {
		return await RestServices.v1.accounts.getStatuses(
			this.client,
			userId,
			opts,
		);
	}

	private createMastoClient() {
		return createRestAPIClient({
			url: `https://${this.client.url}`,
			accessToken: this.client.accessToken,
		});
	}

	async getHomeTimeline(
		opts?: GetPostsQueryDTO,
	): Promise<mastodon.v1.Status[]> {
		try {
			const _client = this.createMastoClient();

			return await _client.v1.timelines.home.list({
				limit: 5,
				maxId: opts?.maxId,
			});
		} catch (e) {
			return [];
		}
	}

	async bookmark(id: string): Promise<MastoStatus | null> {
		try {
			const _client = this.createMastoClient();

			return await _client.v1.statuses.$select(id.toString()).bookmark();
		} catch (e) {
			console.log(e);
			return null;
		}
	}

	async unBookmark(id: string): Promise<MastoStatus | null> {
		try {
			const _client = this.createMastoClient();
			return await _client.v1.statuses.$select(id.toString()).unbookmark();
		} catch (e) {
			console.log(e);
			return null;
		}
	}

	async getTimelineByHashtag(
		q: string,
		query?: HashtagTimelineQuery,
	): Promise<MastoStatus[]> {
		try {
			const _client = this.createMastoClient();
			return await _client.v1.timelines.tag.$select(q).list({
				...query,
				limit: 5,
				onlyMedia: query?.onlyMedia,
			});
		} catch (e) {
			console.log(e);
			return [];
		}
	}

	async getUserProfile(userId: string): Promise<mastodon.v1.Account> {
		return RestServices.v1.accounts.getByUserId(this.client, userId);
	}

	async getStatus(id: string): Promise<mastodon.v1.Status> {
		return RestServices.v1.statuses.getStatus(this.client, id);
	}
}

export default MastodonRestClient;
