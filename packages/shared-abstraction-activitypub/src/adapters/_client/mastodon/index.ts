import ActivityPubClient, {
	GetPostsQueryDTO,
	MastoAccountCredentials,
	MastoConversation,
	MastoList,
	MastoRelationship,
	MastoStatus,
	MediaUploadDTO,
	RestClientCreateDTO,
} from '../_interface.js';
import type { mastodon } from 'masto';
import { RestClient, RestServices } from '@dhaaga/shared-provider-mastodon';
import { StatusArray } from '../../status/_interface.js';
import { createRestAPIClient } from 'masto';
import { MastodonInstanceRouter } from './instance.js';
import { MastodonAccountsRouter } from './accounts.js';
import { KNOWN_SOFTWARE } from '../_router/routes/instance.js';
import { MastodonStatusesRouter } from './statuses.js';
import { MastodonBookmarksRouter } from './bookmarks.js';
import { MastodonTrendsRouter } from './trends.js';
import { MastodonNotificationsRouter } from './notifications.js';
import { MastodonTimelinesRouter } from './timelines.js';
import { MastodonTagRouter } from './tags.js';
import { MastodonSearchRouter } from './search.js';
import { MastodonMeRouter } from './me.js';
import { MastodonMediaRoute } from './media.js';
import { MastodonListRoute } from './lists.js';

class MastodonRestClient implements ActivityPubClient {
	client: RestClient;
	instances: MastodonInstanceRouter;
	accounts: MastodonAccountsRouter;
	statuses: MastodonStatusesRouter;
	bookmarks: MastodonBookmarksRouter;
	trends: MastodonTrendsRouter;
	notifications: MastodonNotificationsRouter;
	timelines: MastodonTimelinesRouter;
	tags: MastodonTagRouter;
	search: MastodonSearchRouter;
	me: MastodonMeRouter;
	media: MastodonMediaRoute;
	lists: MastodonListRoute;

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
		this.notifications = new MastodonNotificationsRouter(this.client);
		this.timelines = new MastodonTimelinesRouter(this.client);
		this.tags = new MastodonTagRouter(this.client);
		this.search = new MastodonSearchRouter(this.client);
		this.me = new MastodonMeRouter(this.client);
		this.media = new MastodonMediaRoute(this.client);
		this.lists = new MastodonListRoute(this.client);
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

	async getRelationshipWith(ids: string[]): Promise<MastoRelationship[]> {
		const _client = this.createMastoClient();
		try {
			return await _client.v1.accounts.relationships.fetch({ id: ids });
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

	private createMastoClient() {
		return createRestAPIClient({
			url: `https://${this.client.url}`,
			accessToken: this.client.accessToken,
		});
	}
}

export default MastodonRestClient;
