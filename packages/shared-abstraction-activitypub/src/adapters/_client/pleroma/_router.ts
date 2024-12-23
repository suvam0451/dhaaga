import ActivityPubClient, { RestClientCreateDTO } from '../_interface.js';
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

class PleromaRestClient implements ActivityPubClient {
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

	constructor(dto: RestClientCreateDTO) {
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
	}
}

export default PleromaRestClient;
