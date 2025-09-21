import { ApiTargetInterface } from '../_router/routes/_index.js';
import { RestClientCreateDTO } from '../_interface.js';
import { PleromaInstanceRouter } from './instance.js';
import { PleromaAccountsRouter } from './accounts.js';
import { PleromaStatusesRouter } from './statuses.js';
import { PleromaTrendsRouter } from './trends.js';
import { PleromaNotificationsRouter } from './notifications.js';
import { PleromaTimelinesRouter } from './timelines.js';
import { PleromaTagsRouter } from './tags.js';
import { PleromaSearchRouter } from './search.js';
import { PleromaMeRouter } from './me.js';
import { PleromaMediaRoute } from './media.js';
import { PleromaListsRoute } from './lists.js';
import FetchWrapper from '../../../custom-clients/custom-fetch.js';
import { PostMutatorRoute } from '../_router/routes/post.js';
import { UserRoute } from '../_router/routes/user.js';
import { KNOWN_SOFTWARE } from '../../../data/driver.js';

class Adapter implements ApiTargetInterface {
	driver: KNOWN_SOFTWARE | string;
	server: string | null;
	key: string;

	fetch: FetchWrapper;
	instances: PleromaInstanceRouter;
	accounts: PleromaAccountsRouter;
	statuses: PleromaStatusesRouter;
	trends: PleromaTrendsRouter;
	notifications: PleromaNotificationsRouter;
	timelines: PleromaTimelinesRouter;
	tags: PleromaTagsRouter;
	search: PleromaSearchRouter;
	me: PleromaMeRouter;
	media: PleromaMediaRoute;
	lists: PleromaListsRoute;
	post: PostMutatorRoute;
	user: UserRoute;

	constructor(
		driver: KNOWN_SOFTWARE | string,
		server: string | null,
		dto: RestClientCreateDTO,
	) {
		this.driver = driver;
		this.server = server;
		this.key = dto.clientId.toString();
		this.fetch = FetchWrapper.create(dto.instance, dto.token);
		this.instances = new PleromaInstanceRouter(this.fetch);
		this.accounts = new PleromaAccountsRouter(this.fetch);
		this.statuses = new PleromaStatusesRouter(this.fetch);
		this.trends = new PleromaTrendsRouter(this.fetch);
		this.notifications = new PleromaNotificationsRouter(this.fetch);
		this.timelines = new PleromaTimelinesRouter(this.fetch);
		this.tags = new PleromaTagsRouter(this.fetch);
		this.search = new PleromaSearchRouter(this.fetch);
		this.me = new PleromaMeRouter(this.fetch);
		this.media = new PleromaMediaRoute(this.fetch);
		this.lists = new PleromaListsRoute(this.fetch);
		this.post = new PostMutatorRoute(this);
		this.user = new UserRoute(this);
	}
}

export { Adapter as PleromaApiAdapter };
