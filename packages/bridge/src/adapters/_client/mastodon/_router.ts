import { RestClientCreateDTO } from '../_interface.js';
import { MastodonInstanceRouter } from './instance.js';
import { MastodonAccountsRouter } from './accounts.js';
import { MastodonStatusesRouter } from './statuses.js';
import { MastodonTrendsRouter } from './trends.js';
import { MastodonNotificationsRouter } from './notifications.js';
import { MastodonTimelinesRouter } from './timelines.js';
import { MastodonTagRouter } from './tags.js';
import { MastodonSearchRouter } from './search.js';
import { MastodonMeRouter } from './me.js';
import { MastodonMediaRoute } from './media.js';
import { MastodonListRoute } from './lists.js';
import { MastodonProfileRouter } from './profile.js';
import { ApiTargetInterface } from '../_router/routes/_index.js';
import FetchWrapper from '../../../custom-clients/custom-fetch.js';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { PostMutatorRoute } from '../_router/routes/post.js';
import { UserRoute } from '../_router/routes/user.js';

class Adapter implements ApiTargetInterface {
	driver: KNOWN_SOFTWARE | string;
	server: string | null;

	fetch: FetchWrapper;
	instances: MastodonInstanceRouter;
	accounts: MastodonAccountsRouter;
	statuses: MastodonStatusesRouter;
	trends: MastodonTrendsRouter;
	notifications: MastodonNotificationsRouter;
	timelines: MastodonTimelinesRouter;
	tags: MastodonTagRouter;
	search: MastodonSearchRouter;
	me: MastodonMeRouter;
	media: MastodonMediaRoute;
	lists: MastodonListRoute;
	profile: MastodonProfileRouter;
	post: PostMutatorRoute;
	user: UserRoute;

	constructor(
		driver: KNOWN_SOFTWARE | string,
		server: string | null,
		dto: RestClientCreateDTO,
	) {
		this.driver = driver;
		this.server = server;
		this.fetch = FetchWrapper.create(dto.instance, dto.token);
		this.instances = new MastodonInstanceRouter(this.fetch);
		this.accounts = new MastodonAccountsRouter(this.fetch);
		this.statuses = new MastodonStatusesRouter(this.fetch);
		this.trends = new MastodonTrendsRouter(this.fetch);
		this.notifications = new MastodonNotificationsRouter(this.fetch);
		this.timelines = new MastodonTimelinesRouter(this.fetch);
		this.tags = new MastodonTagRouter(this.fetch);
		this.search = new MastodonSearchRouter(this.fetch);
		this.me = new MastodonMeRouter(this.fetch);
		this.media = new MastodonMediaRoute(this.fetch);
		this.lists = new MastodonListRoute(this.fetch);
		this.profile = new MastodonProfileRouter(this.fetch);
		this.post = new PostMutatorRoute(this);
		this.user = new UserRoute(this);
	}
}

export { Adapter as MastoApiAdapter };
