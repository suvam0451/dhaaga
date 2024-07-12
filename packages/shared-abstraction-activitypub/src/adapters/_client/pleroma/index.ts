import ActivityPubClient, {
	FollowPostDto,
	GetPostsQueryDTO,
	GetSearchResultQueryDTO,
	GetTimelineQueryDTO,
	GetTrendingPostsQueryDTO,
	GetUserPostsQueryDTO,
	HashtagTimelineQuery,
	MediaUploadDTO,
	RestClientCreateDTO,
	TagArray,
	TrendLinkArray,
} from '../_interface.js';
import { RestClient } from '@dhaaga/shared-provider-mastodon';
import { PleromaInstanceRouter } from './instance.js';
import { StatusArray, Status } from '../../status/_interface.js';
import type { mastodon } from 'masto';
import { PleromaAccountsRouter } from './accounts.js';
import { PleromaStatusesRouter } from './statuses.js';
import { PleromaBookmarksRouter } from './bookmarks.js';
import { PleromaTrendsRouter } from './trends.js';

class PleromaRestClient implements ActivityPubClient {
	client: RestClient;
	instances: PleromaInstanceRouter;
	accounts: PleromaAccountsRouter;
	statuses: PleromaStatusesRouter;
	bookmarks: PleromaBookmarksRouter;
	trends: PleromaTrendsRouter;

	constructor(dto: RestClientCreateDTO) {
		this.client = new RestClient(dto.instance, {
			accessToken: dto.token,
			domain: 'mastodon',
		});
		this.instances = new PleromaInstanceRouter(this.client);
		this.accounts = new PleromaAccountsRouter(this.client);
		this.statuses = new PleromaStatusesRouter(this.client);
		this.bookmarks = new PleromaBookmarksRouter(this.client);
		this.trends = new PleromaTrendsRouter(this.client);
	}

	getHomeTimeline(opts?: GetPostsQueryDTO | undefined): Promise<StatusArray> {
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

	getTimelineByHashtag(
		q: string,
		query?: HashtagTimelineQuery | undefined,
	): Promise<StatusArray> {
		throw new Error('Method not implemented.');
	}

	getListTimeline(
		q: string,
		opts?: GetPostsQueryDTO | undefined,
	): Promise<StatusArray> {
		throw new Error('Method not implemented.');
	}

	getMyConversations(): Promise<mastodon.v1.Conversation[]> {
		throw new Error('Method not implemented.');
	}

	getMyLists(): Promise<mastodon.v1.List[]> {
		throw new Error('Method not implemented.');
	}

	getMe(): Promise<any> {
		throw new Error('Method not implemented.');
	}

	getUserProfile(username: string): Promise<any> {
		throw new Error('Method not implemented.');
	}

	followUser(id: string, opts: FollowPostDto): Promise<any> {
		throw new Error('Method not implemented.');
	}

	unfollowUser(id: string): Promise<any> {
		throw new Error('Method not implemented.');
	}

	getFavourites(opts: GetPostsQueryDTO): Promise<StatusArray> {
		throw new Error('Method not implemented.');
	}

	getUserPosts(
		userId: string,
		opts: GetUserPostsQueryDTO,
	): Promise<StatusArray> {
		throw new Error('Method not implemented.');
	}

	getBookmarks(opts: GetPostsQueryDTO): Promise<{
		data: StatusArray;
		minId?: string | undefined;
		maxId?: string | undefined;
	}> {
		throw new Error('Method not implemented.');
	}

	getRelationshipWith(ids: string[]): Promise<mastodon.v1.Relationship[]> {
		throw new Error('Method not implemented.');
	}

	getFollowing(id: string): Promise<mastodon.v1.Account[] | null> {
		throw new Error('Method not implemented.');
	}

	getFollowers(id: string): Promise<mastodon.v1.Account[] | null> {
		throw new Error('Method not implemented.');
	}

	uploadMedia(params: MediaUploadDTO): Promise<any> {
		throw new Error('Method not implemented.');
	}

	getIsSensitive(): boolean {
		throw new Error('Method not implemented.');
	}

	getSpoilerText(): string | null {
		throw new Error('Method not implemented.');
	}

	getTrendingPosts(opts: GetTrendingPostsQueryDTO): Promise<StatusArray> {
		throw new Error('Method not implemented.');
	}

	getTrendingTags(opts: GetTrendingPostsQueryDTO): Promise<TagArray> {
		throw new Error('Method not implemented.');
	}

	getTrendingLinks(opts: GetTrendingPostsQueryDTO): Promise<TrendLinkArray> {
		throw new Error('Method not implemented.');
	}

	getTag(id: string): Promise<any> {
		throw new Error('Method not implemented.');
	}

	followTag(id: string): Promise<any> {
		throw new Error('Method not implemented.');
	}

	unfollowTag(id: string): Promise<any> {
		throw new Error('Method not implemented.');
	}

	getFollowedTags(opts: GetPostsQueryDTO): Promise<
		| any[]
		| {
				data: mastodon.v1.Tag[];
				minId?: string | undefined;
				maxId?: string | undefined;
		  }
	> {
		throw new Error('Method not implemented.');
	}

	muteUser(id: string): Promise<void> {
		throw new Error('Method not implemented.');
	}

	getStatus(id: string): Promise<Status> {
		throw new Error('Method not implemented.');
	}

	getStatusContext(id: string): Promise<any> {
		throw new Error('Method not implemented.');
	}

	bookmark(id: string): Promise<Status> {
		throw new Error('Method not implemented.');
	}

	unBookmark(id: string): Promise<Status> {
		throw new Error('Method not implemented.');
	}

	favourite(id: string): Promise<Status> {
		throw new Error('Method not implemented.');
	}

	unFavourite(id: string): Promise<Status> {
		throw new Error('Method not implemented.');
	}

	reblog(id: string): Promise<Status> {
		throw new Error('Method not implemented.');
	}

	undoReblog(id: string): Promise<Status> {
		throw new Error('Method not implemented.');
	}

	search(
		q: string,
		dto: GetSearchResultQueryDTO,
	): Promise<{ accounts: []; hashtags: [] }> {
		throw new Error('Method not implemented.');
	}
}

export default PleromaRestClient;
