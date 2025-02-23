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
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { PostMutatorRoute } from '../_router/routes/post.js';

class Adapter implements ApiTargetInterface {
	driver: KNOWN_SOFTWARE | string;
	server: string | null;

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
	post: PostMutatorRoute;

	constructor(
		driver: KNOWN_SOFTWARE | string,
		server: string | null,
		dto: RestClientCreateDTO,
	) {
		this.driver = driver;
		this.server = server;

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
		this.post = new PostMutatorRoute(this);
	}
}

export { Adapter as MisskeyApiAdapter };
