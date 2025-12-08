import { RestClientCreateDTO } from '../types/_interface.js';
import { MisskeyInstanceRouter } from '../collections/servers/misskey.js';
import { MisskeyAccountsRouter } from '../collections/accounts/misskey.js';
import { MisskeyStatusesRouter } from '../collections/posts/misskey.js';
import { MisskeyTrendsRouter } from '../collections/trends/misskey.js';
import { MisskeyNotificationsRouter } from '../collections/notifications/misskey.js';
import { MisskeyTimelinesRouter } from '../collections/timelines/misskey.js';
import { MisskeyTagsRouter } from '../collections/tags/misskey.js';
import { MisskeySearchRouter } from '../collections/search/misskey.js';
import { MisskeyMeRouter } from '../collections/me/misskey.js';
import { MisskeyMediaRouter } from '../collections/media/misskey.js';
import { MisskeyListsRoute } from '../collections/lists/misskey.js';
import FetchWrapper from '../utils/fetch.js';
import { ApiTargetInterface } from '../index.js';
import { UserRoute } from '../shared/wrapper.js';
import { KNOWN_SOFTWARE } from '../utils/driver.js';

class Adapter implements ApiTargetInterface {
	driver: KNOWN_SOFTWARE | string;
	server: string | null;
	key: string;

	fetch: FetchWrapper;
	instances: MisskeyInstanceRouter;
	users: MisskeyAccountsRouter;
	posts: MisskeyStatusesRouter;
	trends: MisskeyTrendsRouter;
	notifications: MisskeyNotificationsRouter;
	timelines: MisskeyTimelinesRouter;
	tags: MisskeyTagsRouter;
	search: MisskeySearchRouter;
	me: MisskeyMeRouter;
	media: MisskeyMediaRouter;
	lists: MisskeyListsRoute;
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
		this.instances = new MisskeyInstanceRouter(this.fetch);
		this.users = new MisskeyAccountsRouter(this.fetch);
		this.posts = new MisskeyStatusesRouter(this.fetch);
		this.trends = new MisskeyTrendsRouter(this.fetch);
		this.notifications = new MisskeyNotificationsRouter(this.fetch);
		this.timelines = new MisskeyTimelinesRouter(this.fetch);
		this.tags = new MisskeyTagsRouter(this.fetch);
		this.search = new MisskeySearchRouter(this.fetch);
		this.me = new MisskeyMeRouter(this.fetch);
		this.media = new MisskeyMediaRouter(this.fetch);
		this.lists = new MisskeyListsRoute(this.fetch);
		this.user = new UserRoute(this);
	}
}

export { Adapter as MisskeyApiAdapter };
