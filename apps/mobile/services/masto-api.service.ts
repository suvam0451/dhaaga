import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { UserMiddleware } from './middlewares/user.middleware';
import { PostMiddleware } from './middlewares/post.middleware';
import { AppNotificationObject } from '../types/app-notification.types';
import { AppResultPageType } from '../types/app.types';

export type MastoApiGroupedNotificationType = {
	groupKey: string;
	notificationsCount: 1;
	type: 'mention';
	mostRecentNotificationId: number;
	pageMinId: string;
	pageMaxId: string;
	latestPageNotificationAt: Date;
	sampleAccountIds: string[];
	statusId: string;
};

class ServiceV1 {
	/**
	 * Resolve notifications for v1 api
	 * grouped notification objects
	 * @param input
	 * @param driver
	 * @param server
	 * @param category
	 */
	static packNotifs(
		input: any,
		driver: KNOWN_SOFTWARE,
		server: string,
		category: 'mentions' | 'chat' | 'social' | 'updates',
	): AppResultPageType<AppNotificationObject> {
		return {
			items: input.data.map((o) => {
				return {
					id: o.id,
					// akkoma uses "mention" type for "status" updates
					type: category === 'updates' ? 'status' : o.type,
					post: PostMiddleware.deserialize(o.status, driver, server),
					user: UserMiddleware.deserialize(o.account, driver, server),
					read: o.pleroma?.isSeen, // also have o.pleroma.isMuted
					createdAt: new Date(o.createdAt),
					extraData: {},
				};
			}),
			maxId: input.maxId,
			minId: input.minId,
			success: true,
		};
	}
}

class ServiceV2 {
	/**
	 * Resolve notifications for v2 api
	 * grouped notification objects
	 * @param input
	 * @param driver
	 * @param server
	 */
	static packNotifs(
		input: any,
		driver: KNOWN_SOFTWARE,
		server: string,
	): AppResultPageType<AppNotificationObject> {
		const acctList = input.data.accounts;
		const postList = input.data.statuses;
		const _retval = input.data.notificationGroups.map(
			(o: MastoApiGroupedNotificationType) => {
				const _acct = UserMiddleware.deserialize<unknown>(
					acctList.find((x) => x.id === o.sampleAccountIds[0]),
					driver,
					server,
				);
				const _post = PostMiddleware.deserialize<unknown>(
					postList.find((x) => x.id === o.statusId),
					driver,
					server,
				);

				const _obj: AppNotificationObject = {
					id: o.groupKey,
					type: o.type,
					post: _post,
					user: _acct,
					read: false,
					createdAt: new Date(o.latestPageNotificationAt),
					extraData: {},
				};
				return _obj;
			},
		);

		return {
			success: true,
			items: _retval,
			maxId: input.maxId,
			minId: input.minId,
		};
	}
}

export { ServiceV1 as MastoApiV1Service, ServiceV2 as MastoApiV2Service };
