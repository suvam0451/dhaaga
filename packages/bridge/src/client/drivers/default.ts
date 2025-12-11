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
import { DefaultProfileRouter } from '../collections/profile/default.js';
import { KNOWN_SOFTWARE } from '../utils/driver.js';

class Adapter implements ApiTargetInterface {
	driver: KNOWN_SOFTWARE | string;
	server: string | null;
	key: string;

	instances: DefaultInstanceRouter;
	users: DefaultAccountRouter;
	posts: DefaultStatusesRouter;
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
		this.driver = KNOWN_SOFTWARE.UNKNOWN;
		this.server = null;
		this.key = 'N/A';
		this.instances = new DefaultInstanceRouter();
		this.users = new DefaultAccountRouter();
		this.posts = new DefaultStatusesRouter();
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
}

export { Adapter as BaseApiAdapter };
