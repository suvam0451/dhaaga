import ActivityPubClient, { MediaUploadDTO } from '../_interface.js';
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
import { Agent, AtpSessionData, CredentialSession } from '@atproto/api';
import { jwtDecode } from 'jwt-decode';

export type AtprotoClientCreateDTO = {
	subdomain: string;
} & AtpSessionData;

class BlueskyRestClient implements ActivityPubClient {
	client: Agent | null;
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

	dto: AtprotoClientCreateDTO;

	cleanLink(urlLike: string) {
		if (urlLike.startsWith('http://') || urlLike.startsWith('https://')) {
		} else {
			urlLike = 'https://' + urlLike;
		}
		return urlLike.replace(/\/+$/, '');
	}

	/**
	 * @deprecated the session checks
	 * should be done right before
	 * calling the endpoints
	 */
	async init() {
		let sessionSaved = null;
		// Fill the session
		const session = new CredentialSession(
			new URL(this.cleanLink(this.dto.subdomain)),
			fetch,
			(evt, session1) => {
				console.log('[INFO]: session obtained', evt, session1);
				sessionSaved = session1;
			},
		);
		session.session = this.dto;

		const _jwt: any = jwtDecode(this.dto.accessJwt);
		const IS_EXPIRED = _jwt.exp < Math.floor(new Date().getTime() / 1000);

		if (IS_EXPIRED) {
			console.log('[INFO]: has session', session.hasSession);
			// monitor this very carefully
			const refreshedSession = await session.refreshSession();
			// FIXME: prints undefined
			console.log('[INFO]: refreshed atproto session', refreshedSession); // ❌
			console.log(sessionSaved);
		} else {
			const currentSession = await session.resumeSession(this.dto);
			// Works until accessToken expires
			console.log('[INFO]: resumed atproto session', currentSession); // ✅
		}
	}

	constructor(dto: AtprotoClientCreateDTO) {
		this.client = null;
		this.dto = dto;
		this.accounts = new BlueskyAccountsRouter(this.dto as any);
		this.instances = new BlueskyInstanceRouter();
		this.lists = new BlueskyListRoute();
		this.me = new BlueskyMeRouter();
		this.media = new BlueskyMediaRouter();
		this.notifications = new BlueskyNotificationsRouter();
		this.profile = new BlueskyProfileRouter();
		this.search = new BlueskySearchRouter();
		this.statuses = new BlueskyStatusesRouter();
		this.tags = new BlueskyTagsRouter();
		this.timelines = new BlueskyTimelinesRouter(this.dto);
		this.trends = new BlueskyTrendsRouter();
	}

	favourite(id: string): Promise<any> {
		return Promise.resolve(undefined);
	}

	getFollowers(id: string): Promise<any | null> {
		return Promise.resolve(undefined);
	}

	getFollowing(id: string): Promise<any | null> {
		return Promise.resolve(undefined);
	}

	getMe(): Promise<any> {
		return Promise.resolve(undefined);
	}

	getMyConversations(): Promise<any> {
		return Promise.resolve([]);
	}

	getMyLists(): Promise<any> {
		return Promise.resolve([]);
	}

	getRelationshipWith(ids: string[]): Promise<any> {
		return Promise.resolve([]);
	}

	unFavourite(id: string): Promise<any> {
		return Promise.resolve(undefined);
	}

	uploadMedia(params: MediaUploadDTO): Promise<any> {
		return Promise.resolve(undefined);
	}
}

export default BlueskyRestClient;