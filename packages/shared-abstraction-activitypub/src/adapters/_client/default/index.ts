import ActivityPubClient, { GetPostsQueryDTO } from '../_interface.js';
import { mastodon } from '@dhaaga/shared-provider-mastodon';
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
import { DefaultMediaRoute } from './media.js';
import { DefaultListRoute } from './lists.js';

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
	media: DefaultMediaRoute;
	lists: DefaultListRoute;

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
		this.media = new DefaultMediaRoute();
		this.lists = new DefaultListRoute();
	}

	async getMyLists() {
		return [];
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

	async getRelationshipWith(ids: string[]) {
		return [];
	}

	async getFavourites(opts: GetPostsQueryDTO) {
		return [];
	}

	async favourite(id: string) {
		return null;
	}

	async unFavourite(id: string) {
		return null;
	}
}

export default UnknownRestClient;
