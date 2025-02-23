import { RestClientCreateDTO } from '../_interface.js';
import { MisskeyInstanceRouter } from './instance.js';
import { MisskeyAccountsRouter } from './accounts.js';
import { MisskeyStatusesRouter } from './statuses.js';
import { MisskeyTrendsRouter } from './trends.js';
import { MisskeyNotificationsRouter } from './notifications.js';
import { MisskeyTimelinesRouter } from './timelines.js';
import { MisskeyTagsRouter } from './tags.js';
import { MisskeySearchRouter } from './search.js';
import { MisskeyMeRouter } from './me.js';
import { MisskeyMediaRouter } from './media.js';
import { MisskeyListsRoute } from './lists.js';
import FetchWrapper from '../../../custom-clients/custom-fetch.js';
import { ApiTargetInterface } from '../_router/routes/_index.js';

class Adapter implements ApiTargetInterface {
	fetch: FetchWrapper;
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
		this.fetch = FetchWrapper.create(dto.instance, dto.token);
		this.instances = new MisskeyInstanceRouter(this.fetch);
		this.accounts = new MisskeyAccountsRouter(this.fetch);
		this.statuses = new MisskeyStatusesRouter(this.fetch);
		this.trends = new MisskeyTrendsRouter(this.fetch);
		this.notifications = new MisskeyNotificationsRouter(this.fetch);
		this.timelines = new MisskeyTimelinesRouter(this.fetch);
		this.tags = new MisskeyTagsRouter(this.fetch);
		this.search = new MisskeySearchRouter(this.fetch);
		this.me = new MisskeyMeRouter(this.fetch);
		this.media = new MisskeyMediaRouter(this.fetch);
		this.lists = new MisskeyListsRoute(this.fetch);
	}
}

export { Adapter as MisskeyApiAdapter };
