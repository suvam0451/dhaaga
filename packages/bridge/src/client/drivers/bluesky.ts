import { ApiTargetInterface } from './_interface.js';
import BlueskyAccountsRouter from '../collections/accounts/bluesky.js';
import { BlueskyInstanceRouter } from '../collections/servers/bluesky.js';
import { BlueskyListRoute } from '../collections/lists/bluesky.js';
import { BlueskyMeRouter } from '../collections/me/bluesky.js';
import BlueskyMediaRouter from '../collections/media/bluesky.js';
import BlueskyNotificationsRouter from '../collections/notifications/bluesky.js';
import BlueskyProfileRouter from '../collections/profile/bluesky.js';
import BlueskySearchRouter from '../collections/search/bluesky.js';
import BlueskyStatusesRouter from '../collections/posts/bluesky.js';
import BlueskyTagsRouter from '../collections/tags/bluesky.js';
import BlueskyTimelinesRouter from '../collections/timelines/bluesky.js';
import BlueskyTrendsRouter from '../collections/trends/bluesky.js';
import { AppAtpSessionData } from '../../types/atproto.js';
import BlueskyFeedRouter from '../collections/feeds/bluesky.js';
import { KNOWN_SOFTWARE } from '../utils/driver.js';
import { getXrpcAgent } from '../../utils/atproto.js';

export type AtprotoClientCreateDTO = AppAtpSessionData;

class Adapter implements ApiTargetInterface {
	driver: KNOWN_SOFTWARE | string;
	server: string | null;
	key: string;

	users: BlueskyAccountsRouter;
	instances: BlueskyInstanceRouter;
	lists: BlueskyListRoute;
	me: BlueskyMeRouter;
	media: BlueskyMediaRouter;
	notifications: BlueskyNotificationsRouter;
	profile: BlueskyProfileRouter;
	search: BlueskySearchRouter;
	posts: BlueskyStatusesRouter;
	tags: BlueskyTagsRouter;
	timelines: BlueskyTimelinesRouter;
	trends: BlueskyTrendsRouter;
	feeds: BlueskyFeedRouter;

	dto: AtprotoClientCreateDTO;

	constructor(
		driver: KNOWN_SOFTWARE | string,
		server: string | null,
		dto: AtprotoClientCreateDTO,
	) {
		this.driver = driver;
		this.server = server;
		this.key = dto.clientId.toString();
		this.dto = dto;
		this.users = new BlueskyAccountsRouter(this.dto);
		this.instances = new BlueskyInstanceRouter();
		this.lists = new BlueskyListRoute();
		this.me = new BlueskyMeRouter(this.dto);
		this.media = new BlueskyMediaRouter();
		this.notifications = new BlueskyNotificationsRouter(this.dto);
		this.profile = new BlueskyProfileRouter();
		this.search = new BlueskySearchRouter(this.dto);
		this.posts = new BlueskyStatusesRouter(this.dto);
		this.tags = new BlueskyTagsRouter();
		this.timelines = new BlueskyTimelinesRouter(this.dto);
		this.trends = new BlueskyTrendsRouter(this.dto);
		this.feeds = new BlueskyFeedRouter(this.dto);
	}

	getAgent() {
		return getXrpcAgent(this.dto);
	}
}

export { Adapter as AtprotoApiAdapter };
