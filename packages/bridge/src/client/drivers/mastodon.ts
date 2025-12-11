import { RestClientCreateDTO } from '../typings.js';
import { MastodonInstanceRouter } from '../collections/servers/mastodon.js';
import { MastodonAccountsRouter } from '../collections/accounts/mastodon.js';
import { MastodonStatusesRouter } from '../collections/posts/mastodon.js';
import { MastodonTrendsRouter } from '../collections/trends/mastodon.js';
import { MastodonNotificationsRouter } from '../collections/notifications/mastodon.js';
import { MastodonTimelinesRouter } from '../collections/timelines/mastodon.js';
import { MastodonTagRouter } from '../collections/tags/mastodon.js';
import { MastodonSearchRouter } from '../collections/search/mastodon.js';
import { MastodonMeRouter } from '../collections/me/mastodon.js';
import { MastodonMediaRoute } from '../collections/media/mastodon.js';
import { MastodonListRoute } from '../collections/lists/mastodon.js';
import { MastodonProfileRouter } from '../collections/profile/mastodon.js';
import { ApiTargetInterface } from '../index.js';
import FetchWrapper from '../utils/fetch.js';
import { KNOWN_SOFTWARE } from '../utils/driver.js';

class Adapter implements ApiTargetInterface {
	driver: KNOWN_SOFTWARE | string;
	server: string | null;
	key: string;

	fetch: FetchWrapper;
	instances: MastodonInstanceRouter;
	users: MastodonAccountsRouter;
	posts: MastodonStatusesRouter;
	trends: MastodonTrendsRouter;
	notifications: MastodonNotificationsRouter;
	timelines: MastodonTimelinesRouter;
	tags: MastodonTagRouter;
	search: MastodonSearchRouter;
	me: MastodonMeRouter;
	media: MastodonMediaRoute;
	lists: MastodonListRoute;
	profile: MastodonProfileRouter;

	constructor(
		driver: KNOWN_SOFTWARE | string,
		server: string | null,
		dto: RestClientCreateDTO,
	) {
		this.driver = driver;
		this.server = server;
		this.key = dto.clientId.toString();
		this.fetch = FetchWrapper.create(dto.instance, dto.token);
		this.instances = new MastodonInstanceRouter(this.fetch);
		this.users = new MastodonAccountsRouter(this.fetch);
		this.posts = new MastodonStatusesRouter(this.fetch);
		this.trends = new MastodonTrendsRouter(this.fetch);
		this.notifications = new MastodonNotificationsRouter(this.fetch);
		this.timelines = new MastodonTimelinesRouter(this.fetch);
		this.tags = new MastodonTagRouter(this.fetch);
		this.search = new MastodonSearchRouter(this.fetch);
		this.me = new MastodonMeRouter(this.fetch);
		this.media = new MastodonMediaRoute(this.fetch);
		this.lists = new MastodonListRoute(this.fetch);
		this.profile = new MastodonProfileRouter(this.fetch);
	}
}

export { Adapter as MastoApiAdapter };
