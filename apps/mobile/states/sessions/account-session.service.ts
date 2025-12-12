import {
	DataSource,
	Account,
	KnownServer,
	KnownServerService,
	AccountService,
	ProfileService,
	AccountMetadataService,
	ACCOUNT_METADATA_KEY,
} from '@dhaaga/db';
import { BaseStorageManager } from './_shared';
import {
	ActivityPubReactionsService,
	ActivityPubReactionStateType,
	ApiTargetInterface,
	BaseApiAdapter,
	DriverService,
	KNOWN_SOFTWARE,
	UserParser,
} from '@dhaaga/bridge';
import type { AtpSessionData } from '@atproto/api';
import type { UserObjectType, CustomEmojiObjectType } from '@dhaaga/bridge';
import { SearchHistoryItemType } from '#/states/sessions/app-session.service';
import { BskyPreferences } from '@atproto/api';
import { AtProtoAuthService } from '@dhaaga/bridge/auth';
import AccountMetadataDbService from '#/services/db/account-metadata-db.service';

enum KEY {
	APP_ACCOUNT_USER_OBJECT_CACHE = 'app/_cache/acct/:id/me',
	SEARCH_RESULTS_TARGET = 'app/_cache/acct/:id/searchHistory',
	ATPROTO_USER_PREFERENCES = 'app/_cache/acct/:id/atProtoUserPreferences',
}

class Storage extends BaseStorageManager {
	getEmojis(server: string) {
		return this.getJson<{
			data: CustomEmojiObjectType[];
			lastFetchedAt: Date;
		}>(`emojis/${server}`);
	}

	setEmojis(server: string, data: CustomEmojiObjectType[]) {
		this.setJson(`emojis/${server}`, {
			data,
			lastFetchedAt: new Date(),
		});
	}

	/**
	 * Search history
	 */

	setSearchHistory(acct: Account, value: SearchHistoryItemType[]) {
		if (value.length > 50) {
			return this.setJson(
				KEY.SEARCH_RESULTS_TARGET.toString().replace('id', acct.id.toString()),
				value.slice(0, 50),
			);
		}
	}

	getSearchHistory(acct: Account): SearchHistoryItemType[] {
		return (
			this.getJson<SearchHistoryItemType[]>(
				KEY.SEARCH_RESULTS_TARGET.toString().replace(':id', acct.id.toString()),
			) ?? []
		);
	}

	setAtProtoUserPreferences(acct: Account, value: BskyPreferences) {
		return this.setJson(
			KEY.ATPROTO_USER_PREFERENCES.toString().replace(
				':id',
				acct.id.toString(),
			),
			value,
		);
	}

	getAtProtoUserPreferences(acct: Account): BskyPreferences | null {
		return this.getJson<BskyPreferences>(
			KEY.ATPROTO_USER_PREFERENCES.toString().replace(
				':id',
				acct.id.toString(),
			),
		);
	}

	getMyUserData(acctId: number) {
		// 6h expiry
		const sixHoursBefore = new Date();
		sixHoursBefore.setHours(sixHoursBefore.getHours() - 6);

		console.log(
			KEY.APP_ACCOUNT_USER_OBJECT_CACHE.toString().replace(
				':id',
				acctId.toString(),
			),
		);
		return this.getJsonWithExpiry<UserObjectType>(
			KEY.APP_ACCOUNT_USER_OBJECT_CACHE.toString().replace(
				':id',
				acctId.toString(),
			),
			sixHoursBefore,
		);
	}

	setMyUserData(acctId: number, data: UserObjectType) {
		console.log(
			KEY.APP_ACCOUNT_USER_OBJECT_CACHE.toString().replace(
				':id',
				acctId.toString(),
			),
		);
		this.setJsonWithExpiry(
			KEY.APP_ACCOUNT_USER_OBJECT_CACHE.toString().replace(
				':id',
				acctId.toString(),
			),
			data,
		);
	}
}

class AccountSessionManager {
	db: DataSource;
	storage: Storage;
	acct: Account;
	serverReactionCache: CustomEmojiObjectType[];
	customEmojis: CustomEmojiObjectType[];

	constructor(db: DataSource, acct: Account) {
		this.db = db;
		this.storage = new Storage();
		this.acct = acct;
		this.serverReactionCache = [];
		this.customEmojis = [];
	}

	loadReactions() {
		if (this.serverReactionCache && this.serverReactionCache.length > 0) return;
		const allEmojis = this.storage.getEmojis(this.acct.server);
		if (!allEmojis) {
			this.serverReactionCache = [];
		} else {
			this.serverReactionCache = allEmojis.data;
		}
	}

	resolveEmoji(
		id: string,
		emojiMap: Map<string, string>,
	): CustomEmojiObjectType | null {
		// avoid storage reads
		let store = null;

		if (emojiMap?.has(id)) {
			return {
				url: emojiMap.get(id),
				shortCode: id,
				aliases: [],
				tags: [],
				staticUrl: emojiMap.get(id),
				visibleInPicker: true,
			};
		}

		if (this.serverReactionCache) {
			store = this.serverReactionCache;
			if (!store) return null;
		} else {
			const allEmojis = this.storage.getEmojis(this.acct.server);
			if (!allEmojis) return null;
			store = allEmojis.data;
		}
		const found = store.find((o) => o.shortCode === id);
		if (!found) {
			console.log('emoji not resolved for', id, emojiMap);
		}
		return found;
	}

	/**
	 * @param reactions the reaction list object from misskey
	 * @param preCalculated some reactions are resolved automatically
	 * by the app dto converters
	 */
	resolveReactions(
		reactions: ActivityPubReactionStateType,
		preCalculated: {
			url?: string;
			width?: number;
			height?: number;
			name?: string;
		}[],
	) {
		let store = this.serverReactionCache;
		if (!store) {
			const allEmojis = this.storage.getEmojis(this.acct.server);
			if (!allEmojis) {
				store = [];
			} else {
				store = allEmojis.data;
			}
		}

		return ActivityPubReactionsService.renderData(reactions, {
			me: this.acct.identifier,
			calculated: preCalculated,
			cache: store,
		});
	}

	/**
	 * Loads custom emojis for the
	 * server the account belongs to
	 */
	async loadCustomEmojis(debug = false) {
		const _server = this.acct.server;

		// Not Supported
		if (this.acct.driver === KNOWN_SOFTWARE.BLUESKY) return;

		const emojis = await this.downloadInstanceEmojis(_server);
		if (emojis) {
			if (debug)
				console.log(
					'[INFO]: custom emojis loaded successfully',
					_server,
					emojis.length,
				);

			this.customEmojis = emojis;
		} else {
			if (debug)
				console.log('[WARN]: custom emojis failed to load', this.acct.server);
		}
	}

	/**
	 * load custom emojis for a server
	 * @param server if loading emojis for a remote server
	 */
	async downloadInstanceEmojis(server?: string) {
		const _server = server || this.acct.server;

		const now = new Date();
		const oneWeekAgo = new Date(now);
		oneWeekAgo.setDate(now.getDate() - 7);

		const has = this.storage.getEmojis(_server);

		if (has) {
			const isExpired = new Date(has.lastFetchedAt) <= oneWeekAgo;
			const isEmpty = has.data.length === 0;
			if (!isExpired && !isEmpty) return has.data;
		}

		const serverRecord = await this.fetchInstanceData(_server);
		if (!serverRecord) return;
		const _url = serverRecord.server;

		const x = new BaseApiAdapter();
		const data = await x.instances.getCustomEmojis(_url);

		this.storage.setJson(`emojis/${_url}`, {
			data,
			lastFetchedAt: new Date(),
		});
		this.storage.setEmojis(_url, data);
		if (this.acct.server === _server) {
		}
		return data;
	}

	async fetchInstanceData(server?: string): Promise<KnownServer | null> {
		const serverRecord = KnownServerService.getByUrl(this.db, server);
		if (serverRecord && serverRecord.driver !== KNOWN_SOFTWARE.UNKNOWN)
			return serverRecord;
		if (!serverRecord || serverRecord.driver === KNOWN_SOFTWARE.UNKNOWN) {
			const x = new BaseApiAdapter();
			const softwareInfoResult = await x.instances.getSoftwareInfo(server);
			if (softwareInfoResult) {
				KnownServerService.upsert(this.db, {
					url: server,
					driver: softwareInfoResult.software,
				});
			}
		}
		return KnownServerService.getByUrl(this.db, server);
	}

	/**
	 * load the app session for a given account
	 * record on the database
	 * @param db
	 */
	async restoreAppSession(db: DataSource): Promise<{
		acct: Account;
		client: ApiTargetInterface;
		me: UserObjectType;
	}> {
		const acct = AccountService.getSelected(db);
		ProfileService.getActiveProfile(db, acct);

		let payload:
			| { instance: string; token: string }
			| (AtpSessionData & { subdomain: string; pdsUrl: string })
			| null = null;

		// Bluesky is built different
		if (acct.driver === KNOWN_SOFTWARE.BLUESKY) {
			let session = AccountMetadataDbService.getAtProtoSession(db, acct);
			if (!session) {
				console.log('[WARN]: no session found for account', acct);
				throw new Error(
					`no session found for account ${acct.username}@${acct.server}`,
				);
			}

			const resumeResult = await AtProtoAuthService.resumeSession(session);
			if (resumeResult === null)
				throw new Error('failed to resume atproto session!');

			const _sess: AtpSessionData = resumeResult.nextSession;
			const _pdsUrl = resumeResult.pdsUrl;

			// save the updated session object
			AccountMetadataDbService.setAtProtoSession(db, acct, _sess);

			payload = {
				..._sess,
				subdomain: acct.server,
				pdsUrl: _pdsUrl,
			};
		} else {
			const token = AccountMetadataService.getKeyValueForAccountSync(
				db,
				acct,
				ACCOUNT_METADATA_KEY.ACCESS_TOKEN,
			);

			payload = {
				instance: acct.server,
				token: token!,
			};
		}
		const client = DriverService.generateApiClient(acct.driver, acct.server, {
			...payload,
			clientId: acct.id,
		});

		let cachedMe = this.storage.getMyUserData(acct.id);
		if (!cachedMe) {
			console.log('[INFO]: cached user data missing/outdated. re-fetching...');
			const meObject = await client.me.getMe();
			console.log(meObject);
			cachedMe = UserParser.parse(meObject, acct.driver, acct.server);
			this.storage.setMyUserData(acct.id, cachedMe);
		} else {
			console.log('[INFO]: using cached user data.');
		}

		return { acct, client, me: cachedMe };
	}
}

export default AccountSessionManager;
