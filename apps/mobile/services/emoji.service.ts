import { MMKV } from 'react-native-mmkv';
import globalMmkvCacheServices from './globalMmkvCache.services';
import { ActivityPubCustomEmojiCategoryRepository } from '../repositories/activitypub-emoji-category.repo';
import { ActivityPubCustomEmojiRepository } from '../repositories/activitypub-emoji.repo';
import {
	InstanceApi_CustomEmojiDTO,
	KNOWN_SOFTWARE,
	UnknownRestClient,
} from '@dhaaga/shared-abstraction-activitypub';
import AppPrivacySettingsService from './app-settings/app-settings-privacy.service';
import { SQLiteDatabase } from 'expo-sqlite';
import { ServerService } from '../database/entities/server';
import { ServerEmojiService } from '../database/entities/server-emoji';

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
	/**
	 * Find a custom emoji in local databases
	 * @param db
	 * @param globalDb
	 * @param id
	 * @param subdomain
	 */
	static find({
		globalDb,
		id,
		subdomain,
	}: {
		db: SQLiteDatabase;
		globalDb: MMKV;
		id: string;
		domain: string;
		subdomain: string;
	}): InstanceApi_CustomEmojiDTO | null {
		const found = this.getEmojiCache(globalDb, subdomain);
		if (!found) {
			console.log('[WARN]: cached emojis not found for', subdomain);
			return null;
		}
		const match = found.find((o) => o.shortCode === id);
		return match || null;
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
	 * Updates the custom emoji
	 * for an instance
	 *
	 * ^ Subjected to Cache-Policy
	 * and Retry-Policy
	 *
	 * @forcedUpdate bypasses user prefs (e.g.- for acct instance)
	 */
	static async refresh(
		db: SQLiteDatabase,
		globalDb: MMKV,
		subdomain: string,
		forceUpdate: boolean = false,
	): Promise<InstanceApi_CustomEmojiDTO[] | null> {
		// Cache-Policy
		const found = globalMmkvCacheServices.getEmojiCacheForInstance(
			globalDb,
			subdomain,
		);

		const now = new Date();
		const oneWeekAgo = new Date(now);
		oneWeekAgo.setDate(now.getDate() - 7);

		const LIST_NOT_EMPTY = found && found?.data?.length > 0;
		const LIST_NOT_EXPIRED = new Date(found?.lastFetchedAt) >= oneWeekAgo;

		if (LIST_NOT_EMPTY && LIST_NOT_EXPIRED) return found.data;

		// Retry-Policy
		// const repo = ActivityPubServerRepository.create(db);
		// const server = repo.get(subdomain);
		// if (!server) {
		// 	// console.log('[INFO]: reaction caching skipped (No-Info)', subdomain);
		// 	return null;
		// }
		// if (!forceUpdate && repo.isReactionFetchRateLimited(server)) {
		// 	// console.log('[INFO]: reaction caching skipped (Retry-Policy)', subdomain);
		// 	return null;
		// }

		// Force-Update-Policy
		// Privacy --> Advanced --> Remote Instance Calls --> Reaction Caching
		if (
			!forceUpdate &&
			AppPrivacySettingsService.create(
				db,
			).isDisabledCrossInstanceReactionCaching()
		)
			return null;

		// All good
		const x = new UnknownRestClient();
		// const { data, error } = await x.instances.getCustomEmojis(
		// 	subdomain,
		// 	server.type,
		// );

		// if (error) {
		// 	// console.log('[WARN]: failed to get emojis');
		// 	return null;
		// }

		// db.write(() => {
		// 	ActivityPubServerRepository.updateEmojisLastFetchedAt(db, subdomain, now);
		// });
		// console.log('[INFO]: cached emojis for', subdomain, data.length);

		// return GlobalMmkvCacheService.saveEmojiCacheForInstance(
		// 	globalDb,
		// 	subdomain,
		// 	data,
		// );
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
		id,
		remoteInstance,
	}: {
		emojiMap: Map<string, string>;
		db: SQLiteDatabase;
		globalDb: MMKV;
		id: string;
		remoteInstance: string;
	}) {
		if (emojiMap?.get(id)) {
			return emojiMap?.get(id);
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
		db: SQLiteDatabase,
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
	}

	/**
	 * NOTE: forcedUpdate should be seldom called to not repeat calls
	 * @param db
	 * @param globalDb
	 * @param subdomain
	 * @param selection if provided, will skip any emoji not in this list
	 */
	static async loadEmojisForInstance(
		db: SQLiteDatabase,
		globalDb: MMKV,
		subdomain: string,
		{
			selection,
		}: {
			selection?: Set<string>;
		} = { selection: new Set() },
	) {
		let data = await this.refresh(db, globalDb, subdomain);
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

		const server = await ServerService.upsert(db, {
			driver: KNOWN_SOFTWARE.UNKNOWN,
			description: 'N/A',
			url: subdomain,
		});

		ActivityPubCustomEmojiCategoryRepository.addCategories(
			db,
			Array.from(categories),
		);
		await ServerEmojiService.upsertMany(db, server, data);
	}
}
