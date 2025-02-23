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
import { PostMutatorRoute } from '../_router/routes/post.js';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';

class Adapter implements ApiTargetInterface {
	driver: KNOWN_SOFTWARE | string;
	server: string | null;

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
	post: PostMutatorRoute;

	constructor() {
		this.driver = KNOWN_SOFTWARE.UNKNOWN;
		this.server = null;
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
		this.post = new PostMutatorRoute(this);
	}
}

export { Adapter as BaseApiAdapter };
