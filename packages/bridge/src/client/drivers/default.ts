import { ApiTargetInterface } from './_interface.js';
import { DefaultInstanceRouter } from '../collections/servers/default.js';
import { DefaultAccountRouter } from '../collections/accounts/default.js';
import { DefaultStatusesRouter } from '../collections/posts/default.js';
import { DefaultTrendsRouter } from '../collections/trends/default.js';
import { DefaultNotificationsRouter } from '../collections/notifications/default.js';
import { DefaultTimelinesRouter } from '../collections/timelines/default.js';
import { DefaultTagRouter } from '../collections/tags/default.js';
import { DefaultSearchRouter } from '../collections/search/default.js';
import { DefaultMeRouter } from '../collections/me/default.js';
import { DefaultMediaRoute } from '../collections/media/default.js';
import { DefaultListRoute } from '../collections/lists/default.js';
import { DefaultProfileRouter } from '../../adapters/_client/default/profile.js';
import { PostMutatorRoute } from '../shared/post.js';
import { UserRoute } from '../shared/wrapper.js';
import { KNOWN_SOFTWARE } from '../../data/driver.js';

class Adapter implements ApiTargetInterface {
	driver: KNOWN_SOFTWARE | string;
	server: string | null;
	key: string;

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
	user: UserRoute;

	constructor() {
		this.driver = KNOWN_SOFTWARE.UNKNOWN;
		this.server = null;
		this.key = 'N/A';
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
		this.user = new UserRoute(this);
	}
}

export { Adapter as BaseApiAdapter };
