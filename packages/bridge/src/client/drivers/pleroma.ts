import { ApiTargetInterface } from '../index.js';
import { RestClientCreateDTO } from '../typings.js';
import { PleromaInstanceRouter } from '../collections/servers/pleroma.js';
import { PleromaAccountsRouter } from '../collections/accounts/pleroma.js';
import { PleromaStatusesRouter } from '../collections/posts/pleroma.js';
import { PleromaTrendsRouter } from '../collections/trends/pleroma.js';
import { PleromaNotificationsRouter } from '../collections/notifications/pleroma.js';
import { PleromaTimelinesRouter } from '../collections/timelines/pleroma.js';
import { PleromaTagsRouter } from '../collections/tags/pleroma.js';
import { PleromaSearchRouter } from '../collections/search/pleroma.js';
import { PleromaMeRouter } from '../collections/me/pleroma.js';
import { PleromaMediaRoute } from '../collections/media/pleroma.js';
import { PleromaListsRoute } from '../collections/lists/pleroma.js';
import FetchWrapper from '../utils/fetch.js';
import { KNOWN_SOFTWARE } from '../utils/driver.js';

class Adapter implements ApiTargetInterface {
	driver: KNOWN_SOFTWARE | string;
	server: string | null;
	key: string;

	fetch: FetchWrapper;
	instances: PleromaInstanceRouter;
	users: PleromaAccountsRouter;
	posts: PleromaStatusesRouter;
	trends: PleromaTrendsRouter;
	notifications: PleromaNotificationsRouter;
	timelines: PleromaTimelinesRouter;
	tags: PleromaTagsRouter;
	search: PleromaSearchRouter;
	me: PleromaMeRouter;
	media: PleromaMediaRoute;
	lists: PleromaListsRoute;

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
		this.users = new PleromaAccountsRouter(this.fetch);
		this.posts = new PleromaStatusesRouter(this.fetch);
		this.trends = new PleromaTrendsRouter(this.fetch);
		this.notifications = new PleromaNotificationsRouter(this.fetch);
		this.timelines = new PleromaTimelinesRouter(this.fetch);
		this.tags = new PleromaTagsRouter(this.fetch);
		this.search = new PleromaSearchRouter(this.fetch);
		this.me = new PleromaMeRouter(this.fetch);
		this.media = new PleromaMediaRoute(this.fetch);
		this.lists = new PleromaListsRoute(this.fetch);
	}
}

export { Adapter as PleromaApiAdapter };
