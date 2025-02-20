import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { AppResultPageType } from '../types/app.types';
import { produce } from 'immer';
import { UserParser, PostParser } from '@dhaaga/core';
import type { NotificationObjectType } from '@dhaaga/core';

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
	): AppResultPageType<NotificationObjectType> {
		return {
			items: input.data.map((o) => {
				return {
					id: o.id,
					// akkoma uses "mention" type for "status" updates
					type: category === 'updates' ? 'status' : o.type,
					post: PostParser.parse(o.status, driver, server),
					user: UserParser.parse(o.account, driver, server),
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
	): AppResultPageType<NotificationObjectType> {
		const acctList = input.data.accounts;
		const postList = input.data.statuses;
		const seenPost = new Map();
		let counter = 0;
		const results: NotificationObjectType[] = [];
		for (const group of input.data.notificationGroups) {
			const _group: MastoApiGroupedNotificationType = group;

			// handles groups that have no post association
			if (_group.statusId === undefined) {
				results.push({
					id: group.groupKey,
					type: group.type,
					user: null,
					post: null,
					users: group.sampleAccountIds.map((o: string) => ({
						item: UserParser.parse<unknown>(
							acctList.find((x: any) => x.id === o),
							driver,
							server,
						),
						type: group.type,
					})),
					read: true,
					createdAt: group.latestPageNotificationAt,
				});
				counter++;
				continue;
			}

			// handle groups that have no post association
			if (!seenPost.has(group.statusId)) {
				results.push({
					id: group.groupKey,
					/**
					 * Keep it as is. In case of ungrouped
					 * notification with 1 user, this will
					 * make sure the singlet views are used,
					 * instead
					 */
					type: group.type,
					user: null,
					post: PostParser.parse<unknown>(
						postList.find((x) => x.id === group.statusId),
						driver,
						server,
					),
					users: group.sampleAccountIds.map((o: string) => ({
						item: UserParser.parse<unknown>(
							acctList.find((x: any) => x.id === o),
							driver,
							server,
						),
						types: [group.type],
					})),
					read: true,
					createdAt: group.latestPageNotificationAt,
				});

				seenPost.set(group.statusId, counter);
				counter++;
			} else {
				const idx = seenPost.get(group.statusId);
				for (const id of group.sampleAccountIds) {
					results[idx] = produce(results[idx], (draft) => {
						const match = draft.users?.find((o) => o.item.id === id);
						if (match) {
							if (!match.types.includes(group.type)) {
								match.types.push(group.type);
							}
						} else {
							draft.users?.push({
								item: UserParser.parse<unknown>(
									acctList.find((x: any) => x.id === id),
									driver,
									server,
								),
								types: [group.type],
							});
						}
					});
				}
			}
		}

		return {
			success: true,
			items: results,
			maxId: input.maxId,
			minId: input.minId,
		};

		/**
		 * This was previously used to handle
		 * Mastodon notifications as singlets
		 */

		// const _retval = input.data.notificationGroups.map(
		// 	(o: MastoApiGroupedNotificationType) => {
		// 		const _acct = UserParser.parse<unknown>(
		// 			acctList.find((x) => x.id === o.sampleAccountIds[0]),
		// 			driver,
		// 			server,
		// 		);
		// 		const _post = PostParser.parse<unknown>(
		// 			postList.find((x) => x.id === o.statusId),
		// 			driver,
		// 			server,
		// 		);
		//
		// 		const _obj: AppNotificationObject = {
		// 			id: o.groupKey,
		// 			type: o.type,
		// 			post: _post,
		// 			user: _acct,
		// 			read: false,
		// 			createdAt: new Date(o.latestPageNotificationAt),
		// 			extraData: {},
		// 		};
		// 		return _obj;
		// 	},
		// );

		// return {
		// 	success: true,
		// 	items: _retval,
		// 	maxId: input.maxId,
		// 	minId: input.minId,
		// };
	}
}

export { ServiceV1 as MastoApiV1Service, ServiceV2 as MastoApiV2Service };
