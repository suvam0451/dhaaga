import ActivityPubService from './activitypub.service';
import { Realm } from 'realm';
import { MMKV } from 'react-native-mmkv';
import globalMmkvCacheServices from './globalMmkvCache.services';
import { ActivityPubCustomEmojiCategoryRepository } from '../repositories/activitypub-emoji-category.repo';
import { ActivityPubServerRepository } from '../repositories/activitypub-server.repo';
import { ActivityPubCustomEmojiRepository } from '../repositories/activitypub-emoji.repo';
import activitypubAdapterService from './activitypub-adapter.service';
import { EmojiMapValue } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/profile/_interface';
import { Status } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/status/_interface';
import { InstanceApi_CustomEmojiDTO } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/_client/_router/instance';

export type EmojiAdapter = {
	// common
	identifier: string;
	url: string;
	staticUrl: string;
	visibleInPicker: boolean;
	// misskey
	aliases?: string;
	category?: string;
};

export class EmojiService {
	static async find(
		db: Realm,
		{
			id,
			domain,
			subdomain,
		}: {
			id: string;
			domain: string;
			subdomain: string;
		},
	) {
		return null;
	}

	/**
	 * Synchronous operation to hit the emoji cache.
	 *
	 * In the future, we should add expiry validation
	 * @param globalDb
	 * @param subdomain
	 */
	static getEmojiCache(globalDb: MMKV, subdomain: string) {
		const found = globalMmkvCacheServices.getEmojiCacheForInstance(
			globalDb,
			subdomain,
		);
		if (found) {
			return found.data;
		}
	}

	/**
	 * Update the emoji raw cache everyday
	 * @param db
	 * @param globalDb
	 * @param subdomain
	 * @param forcedUpdate
	 * @returns
	 */
	static async resolveEmojis(
		db: Realm,
		globalDb: MMKV,
		subdomain: string,
		{ forcedUpdate }: { forcedUpdate: boolean } = { forcedUpdate: true },
	) {
		const found = globalMmkvCacheServices.getEmojiCacheForInstance(
			globalDb,
			subdomain,
		);
		// TODO: this needs to be brought back
		// if (found) {
		// console.log("[INFO]: found cached emojis:", subdomain, found.data.length,
		//     formatRelative(found.lastFetchedAt, new Date()))
		// 	return found.data;
		// }

		// do not refetch, if cache miss
		// if (!forcedUpdate) return;

		// GlobalMmkvCacheService
		const result =
			await ActivityPubService.fetchEmojisAndInstanceSoftware(subdomain);

		db.write(() => {
			ActivityPubServerRepository.updateSoftwareType(db, {
				type: result.software,
				url: subdomain,
				description: 'N/A',
			});
		});

		if (!result) return;
		globalMmkvCacheServices.saveEmojiCacheForInstance(
			globalDb,
			subdomain,
			result.emojis,
		);
		return result.emojis;
	}

	/**
	 * Fetches list of remote emojis and
	 * saves the ones current encountered in the db (to save space)
	 *
	 * The fetched cache is stored in MMKV and cleared on reload
	 */
	static async loadEmojiSelectionForRemoteInstance(
		db: Realm,
		globalDb: MMKV,
		subdomain: string,
		detectedList: string[],
	) {
		await this.loadEmojisForInstance(db, globalDb, subdomain, {
			selection: new Set(detectedList),
			forcedUpdate: false,
		});
	}

	/**
	 * Use it to preload emoji api responses,
	 * for each detected instance in the list
	 * of statuses provided
	 * @param db
	 * @param globalDb
	 * @param statusesRaw
	 * @param domain
	 */
	static async preloadInstanceEmojisForStatuses(
		db: Realm,
		globalDb: MMKV,
		statusesRaw: Status[] | any[],
		domain: string,
	) {
		const statusIs = activitypubAdapterService.adaptManyStatuses(
			statusesRaw,
			domain,
		);

		// dedup
		const instanceSet = new Set<string>();
		for (let i = 0; i < statusIs.length; i++) {
			const _user = activitypubAdapterService.adaptUser(
				statusIs[i].getUser(),
				domain,
			);
			if (!instanceSet.has(_user.getInstanceUrl()))
				instanceSet.add(_user.getInstanceUrl());
		}

		// @ts-ignore-next-line
		const calls = [...instanceSet].map((o) =>
			this.resolveEmojis(db, globalDb, o).catch((e) => ({
				error: e,
				errorData: o,
			})),
		);
		await Promise.all(calls).then((results) => {
			results.forEach((res) => {
				if (res?.['error']) {
					// console.log("[WARN]: emoji fetch failed for", res["errorData"])
				} else {
					// console.log("[INFO]: emoji not loaded for", res["errorData"])
				}
			});
		});
	}

	/**
	 * try resolving url for the emoji item
	 *
	 * #1 -- try the emoji mapping provided by ActivityPub
	 * #2 -- try the local database
	 * #3 -- (should not need to) resolve the emoji from api cache
	 */
	static findCachedEmoji({
		emojiMap,
		db,
		globalDb,
		id,
		remoteInstance,
	}: {
		emojiMap: Map<string, EmojiMapValue>;
		db: Realm;
		globalDb: MMKV;
		id: string;
		remoteInstance: string;
	}) {
		if (emojiMap.get(id)) {
			return emojiMap.get(id).url;
		} else {
			return ActivityPubCustomEmojiRepository.search(db, id, remoteInstance)
				?.url;
		}
	}

	/**
	 * Synchronously reads emoji cache and loads
	 * requested emoji selection onto the main
	 * database
	 * @param db
	 * @param globalDb
	 * @param subdomain
	 * @param selection
	 */
	static loadEmojisForInstanceSync(
		db: Realm,
		globalDb: MMKV,
		subdomain: string,
		{
			selection,
		}: {
			selection?: Set<string>;
		},
	) {
		let data = this.getEmojiCache(globalDb, subdomain);
		if (!data) return;

		if (selection) data = data.filter((o) => selection.has(o.shortCode));

		const categories = new Set<string>();
		for (let i = 0; i < data.length; i++) {
			const emoji = data[i];
			if (!emoji.category) {
				continue;
			}
			if (!categories.has(emoji.category)) {
				categories.add(emoji.category);
			}
		}

		// console.log("[INFO]: loading emojis in db", subdomain, data.length, categories.size)

		db.write(() => {
			const server = ActivityPubServerRepository.upsert(db, subdomain);
			ActivityPubCustomEmojiCategoryRepository.addCategories(
				db,
				Array.from(categories),
			);
			for (let i = 0; i < data.length; i++) {
				// FIXME: it seems this operation is performed outside a write
				//  transaction
				try {
					ActivityPubCustomEmojiRepository.upsert(db, data[i], server);
				} catch (e) {
					console.log('[ERROR]: emoji insert failed. Look for FIXME');
				}
			}
		});
	}

	/**
	 *
	 * NOTE: forcedUpdate should be seldom called to not repeat calls
	 * @param db
	 * @param globalDb
	 * @param subdomain
	 * @param selection if provided, will skip any emoji not in this list
	 * @param forcedUpdate if true, will cause cache miss to call the emoji api
	 */
	static async loadEmojisForInstance(
		db: Realm,
		globalDb: MMKV,
		subdomain: string,
		{
			selection,
			forcedUpdate,
		}: {
			selection?: Set<string>;
			forcedUpdate: boolean;
		} = { selection: new Set(), forcedUpdate: false },
	) {
		let data = await this.resolveEmojis(db, globalDb, subdomain, {
			forcedUpdate,
		});
		console.log(
			'[DEBUG]: emojis obtained for',
			subdomain,
			data.length,
			selection,
		);

		if (!data) return;

		if (selection.size > 0)
			data = data.filter((o) => selection.has(o.shortCode));

		const categories = new Set<string>();
		for (let i = 0; i < data.length; i++) {
			const emoji = data[i];
			if (!emoji.category) {
				continue;
			}
			if (!categories.has(emoji.category)) {
				categories.add(emoji.category);
			}
		}

		console.log(
			'[INFO]: loading emojis in db',
			subdomain,
			data.length,
			categories.size,
		);

		db.write(() => {
			// ActivityPubCustomEmojiRepository.clearAll(db)
			const server = ActivityPubServerRepository.upsert(db, subdomain);
			ActivityPubCustomEmojiCategoryRepository.addCategories(
				db,
				Array.from(categories),
			);
			ActivityPubCustomEmojiRepository.upsertMany(db, data, server);
		});
	}
}
