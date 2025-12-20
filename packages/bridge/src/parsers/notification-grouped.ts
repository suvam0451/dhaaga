import { PostParser } from '#/parsers/post.js';
import { UserParser } from '#/parsers/user.js';
import {
	MastoApiGroupedNotificationType,
	NotificationObjectType,
} from '#/types/shared/notifications.js';
import { produce } from 'immer';
import { RandomUtil } from '#/utils/index.js';
import { MastoGroupedNotificationsResults } from '#/types/index.js';
import { AppBskyNotificationListNotifications } from '@atproto/api';
import { ApiTargetInterface, AtprotoApiAdapter } from '#/client/index.js';
import { ResultPage } from '#/types/api-response.js';

class Parser {
	/**
	 * Resolve notifications for v1 api
	 * grouped notification objects
	 * @param input
	 * @param driver
	 * @param server
	 * @param category
	 */
	static parseForMastodonV1(
		input: any,
		driver: string,
		server: string,
		category: 'mentions' | 'chat' | 'social' | 'updates',
	): ResultPage<NotificationObjectType[]> {
		return {
			data: input.data.map((o: any) => {
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
		};
	}

	/**
	 * This should apply for newer mastodon servers
	 * that have grouped notifications enabled
	 * @param input
	 * @param driver
	 * @param server
	 */
	static parseForMastodonV2(
		input: ResultPage<MastoGroupedNotificationsResults>,
		driver: string,
		server: string,
	): ResultPage<NotificationObjectType[]> {
		const acctList = input.data.accounts;
		const postList = input.data.statuses;
		const seenPost = new Map();
		let counter = 0;
		const results: NotificationObjectType[] = [];
		for (const group of input.data.notificationGroups) {
			const _group: MastoApiGroupedNotificationType = group as any;

			// handles groups that have no post-association
			if (_group.statusId === undefined) {
				results.push({
					id: group.groupKey,
					type: group.type,
					post: null,
					users: (group.sampleAccountIds as unknown as string[]).map(
						(o: string) => ({
							item: UserParser.parse<unknown>(
								acctList.find((x: any) => x.id === o),
								driver,
								server,
							),
							types: [group.type],
							extraData: {},
						}),
					),
					read: true,
					createdAt: group.latestPageNotificationAt
						? new Date(group.latestPageNotificationAt)
						: new Date(),
					extraData: {},
				});
				counter++;
			} else if (!seenPost.has(_group.statusId)) {
				const post = PostParser.parse<unknown>(
					postList.find((x: any) => x.id === group.statusId),
					driver,
					server,
				);
				results.push({
					id: group.groupKey,
					/**
					 * Keep it as is. In case of ungrouped
					 * notification with 1 user, this will
					 * make sure the singlet views are used,
					 * instead
					 */
					type: group.type,
					post,
					users: (group.sampleAccountIds as unknown as string[]).map(
						(o: string) => ({
							item: UserParser.parse<unknown>(
								acctList.find((x: any) => x.id === o),
								driver,
								server,
							),
							types: [group.type],
							extraData: {},
						}),
					),
					read: true,
					createdAt: group.latestPageNotificationAt
						? new Date(group.latestPageNotificationAt)
						: new Date(),
					extraData: {
						interaction: post!.interaction,
					},
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
								item: {
									...UserParser.parse<unknown>(
										acctList.find((x: any) => x.id === id),
										driver,
										server,
									),
								},
								extraData: {},
								types: [group.type],
							});
						}
					});
				}
			}
		}

		return {
			data: results,
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

	/**
	 * Translates misskey notification objects
	 * for usage throughout the app
	 * @param data make sure to pass correct object
	 * @param driver misskey compatible driver
	 * @param server your home server
	 *
	 * NOTE: converts 'specified' visibility to
	 * 'chat'
	 */
	static parseForMisskey(
		data: any,
		driver: string,
		server: string,
	): ResultPage<NotificationObjectType[]> {
		return {
			data: data.data
				.map((o: any) => {
					try {
						if (['achievementEarned', 'note:grouped'].includes(o.type)) {
							return null;
						}

						const _postTarget = !!o.note ? o.note : o;

						const _acct = !['login'].includes(o.type)
							? UserParser.parse<unknown>(o.user, driver, server)
							: null;
						// cherrypick fixes
						const _post =
							_postTarget &&
							!['login', 'follow', 'followRequestAccepted'].includes(o.type)
								? PostParser.parse<unknown>(_postTarget, driver, server)
								: null;

						if (!_post) {
							console.log('[WARN]: failed to pack notification for', o);
							return null;
						}

						const _obj: NotificationObjectType = {
							id: RandomUtil.nanoId(),
							type:
								o.type ||
								(_post.visibility === 'specified' ? 'chat' : _post.visibility),
							post: _post,
							read: false,
							users: [
								{
									item: _acct!,
									types: [o.type],
									extraData: {},
								},
							],
							createdAt: new Date(o.createdAt || _post.createdAt),
							extraData: {},
						};
						return _obj;
					} catch (e) {
						console.log('[WARN]: failed to resolve notification', e);
						return null;
					}
				})
				.filter(Boolean),
			minId: null,
			maxId: data.data[data.data.length - 1].id,
		};
	}

	/**
	 * 	The post statistics are not resolved at this point.
	 * 	Additional API call needs to be made to
	 * 	xrpc/app.bsky.feed.getPosts?uris=
	 *
	 * @param data
	 * @param client
	 * @param driver
	 * @param server
	 */
	static async parseForBluesky(
		data: ResultPage<AppBskyNotificationListNotifications.Notification[]>,
		client: ApiTargetInterface,
		driver: string,
		server: string,
	): Promise<ResultPage<NotificationObjectType[]>> {
		let results = data.data.map((o) => {
			const _user = UserParser.parse<unknown>(o.author, driver, server);
			const _post =
				o.record && o.record.$type === 'app.bsky.feed.post'
					? PostParser.parse<unknown>(o, driver, server)
					: null;
			return {
				id: o.uri,
				uri: o.uri,
				cid: o.cid,
				type: o.reason,
				post: _post,
				createdAt: new Date(o.indexedAt),
				read: o.isRead,
				extraData: {},
				users: [
					{
						item: _user!,
						types: [o.reason],
						extraData: {},
					},
				],
			};
		});

		const uris = results.map((o) => o.uri);
		const posts = await (client as AtprotoApiAdapter).posts.getPosts(uris);
		const parsed = PostParser.parse<unknown[]>(posts, driver, server);

		results = results.map((o) => ({
			...o,
			post: parsed.find((x) => x.id === o.uri) || o.post,
		}));

		return {
			...data,
			data: results,
		};
	}
}

export { Parser as GroupedNotificationParser };
