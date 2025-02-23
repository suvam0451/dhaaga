import { ApiTargetInterface } from '../_router/routes/_index.js';
import BlueskyAccountsRouter from './accounts.js';
import { BlueskyInstanceRouter } from './instance.js';
import { BlueskyListRoute } from './lists.js';
import { BlueskyMeRouter } from './me.js';
import BlueskyMediaRouter from './media.js';
import BlueskyNotificationsRouter from './notifications.js';
import BlueskyProfileRouter from './profile.js';
import BlueskySearchRouter from './search.js';
import BlueskyStatusesRouter from './statuses.js';
import BlueskyTagsRouter from './tags.js';
import BlueskyTimelinesRouter from './timelines.js';
import BlueskyTrendsRouter from './trends.js';
import { AppAtpSessionData } from '../../../types/atproto.js';
import BlueskyFeedRouter from './feeds.js';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { UnifiedPostRouter } from '../default/post.js';

export type AtprotoClientCreateDTO = AppAtpSessionData;

class Adapter implements ApiTargetInterface {
	driver: KNOWN_SOFTWARE | string;
	server: string | null;

	accounts: BlueskyAccountsRouter;
	instances: BlueskyInstanceRouter;
	lists: BlueskyListRoute;
	me: BlueskyMeRouter;
	media: BlueskyMediaRouter;
	notifications: BlueskyNotificationsRouter;
	profile: BlueskyProfileRouter;
	search: BlueskySearchRouter;
	statuses: BlueskyStatusesRouter;
	tags: BlueskyTagsRouter;
	timelines: BlueskyTimelinesRouter;
	trends: BlueskyTrendsRouter;
	feeds: BlueskyFeedRouter;
	post: UnifiedPostRouter;

	dto: AtprotoClientCreateDTO;

	constructor(
		driver: KNOWN_SOFTWARE | string,
		server: string | null,
		dto: AtprotoClientCreateDTO,
	) {
		this.driver = driver;
		this.server = server;
		this.dto = dto;
		this.accounts = new BlueskyAccountsRouter(this.dto);
		this.instances = new BlueskyInstanceRouter();
		this.lists = new BlueskyListRoute();
		this.me = new BlueskyMeRouter(this.dto);
		this.media = new BlueskyMediaRouter();
		this.notifications = new BlueskyNotificationsRouter(this.dto);
		this.profile = new BlueskyProfileRouter();
		this.search = new BlueskySearchRouter(this.dto);
		this.statuses = new BlueskyStatusesRouter(this.dto);
		this.tags = new BlueskyTagsRouter();
		this.timelines = new BlueskyTimelinesRouter(this.dto);
		this.trends = new BlueskyTrendsRouter();
		this.feeds = new BlueskyFeedRouter(this.dto);
		this.post = new UnifiedPostRouter(this);
	}
}

export { Adapter as AtprotoApiAdapter };
