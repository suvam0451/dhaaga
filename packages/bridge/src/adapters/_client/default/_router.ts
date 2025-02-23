import { ApiTargetInterface } from '../_router/routes/_index.js';
import { DefaultInstanceRouter } from './instance.js';
import { DefaultAccountRouter } from './accounts.js';
import { DefaultStatusesRouter } from './statuses.js';
import { DefaultTrendsRouter } from './trends.js';
import { DefaultNotificationsRouter } from './notifications.js';
import { DefaultTimelinesRouter } from './timelines.js';
import { DefaultTagRouter } from './tags.js';
import { DefaultSearchRouter } from './search.js';
import { DefaultMeRouter } from './me.js';
import { DefaultMediaRoute } from './media.js';
import { DefaultListRoute } from './lists.js';
import { DefaultProfileRouter } from './profile.js';
import { MastoAccount } from '../../../types/mastojs.types.js';
import { GetPostsQueryDTO } from '../_interface.js';

class Adapter implements ApiTargetInterface {
	instances: DefaultInstanceRouter;
	accounts: DefaultAccountRouter;
	statuses: DefaultStatusesRouter;
	trends: DefaultTrendsRouter;
	notifications: DefaultNotificationsRouter;
	timelines: DefaultTimelinesRouter;
	tags: DefaultTagRouter;
	search: DefaultSearchRouter;
	me: DefaultMeRouter;
	media: DefaultMediaRoute;
	lists: DefaultListRoute;
	profile: DefaultProfileRouter;

	constructor() {
		this.instances = new DefaultInstanceRouter();
		this.accounts = new DefaultAccountRouter();
		this.statuses = new DefaultStatusesRouter();
		this.trends = new DefaultTrendsRouter();
		this.notifications = new DefaultNotificationsRouter();
		this.timelines = new DefaultTimelinesRouter();
		this.tags = new DefaultTagRouter();
		this.search = new DefaultSearchRouter();
		this.me = new DefaultMeRouter();
		this.media = new DefaultMediaRoute();
		this.lists = new DefaultListRoute();
		this.profile = new DefaultProfileRouter();
	}

	async getMyLists() {
		return [];
	}

	uploadMedia(): Promise<any> {
		throw new Error('Method not implemented.');
	}

	getFollowing(id: string): Promise<any[] | MastoAccount[]> {
		throw new Error('Method not implemented.');
	}

	getFollowers(id: string): Promise<any[] | MastoAccount[]> {
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

export { Adapter as BaseApiAdapter };
