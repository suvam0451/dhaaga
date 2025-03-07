import {
	DataSource,
	Account,
	Profile,
	KnownServer,
	KnownServerService,
	AccountService,
	ProfileService,
	ProfilePinnedUserService,
} from '@dhaaga/db';
import {
	ApiTargetInterface,
	InstanceApi_CustomEmojiDTO,
	KNOWN_SOFTWARE,
	BaseApiAdapter,
} from '@dhaaga/bridge';
import { BaseStorageManager } from './_shared';
import type { UserObjectType } from '@dhaaga/bridge';

/**
 * ---- Storage Interfaces ----
 */

class Storage extends BaseStorageManager {
	getEmojis(server: string) {
		return this.getJson<{
			data: InstanceApi_CustomEmojiDTO[];
			lastFetchedAt: Date;
		}>(`emojis/${server}`);
	}

	setEmojis(server: string, data: InstanceApi_CustomEmojiDTO[]) {
		this.setJson(`emojis/${server}`, {
			data,
			lastFetchedAt: new Date(),
		});
	}
}

/**
 *	Class to manage Non-Reactive state
 *
 * e.g. - fetching and storing remote data
 * e.g. - caching emojis
 */
class ProfileSessionManager {
	acct: Account;
	profile: Profile;
	// databases
	db: DataSource;
	// api clients
	client: ApiTargetInterface;

	cacheManager: Storage;
	customEmojis: InstanceApi_CustomEmojiDTO[];

	constructor(db: DataSource) {
		this.db = db;
		this.cacheManager = new Storage();

		this.acct = AccountService.getSelected(this.db).unwrap();
		this.profile = ProfileService.getActiveProfile(this.db, this.acct);
		this.customEmojis = [];
	}

	/**
	 * Pins a user to the social hub
	 * @param server the server to resolve against. this
	 * should be the user's home server for the foreseeable future
	 * @param userObj copy of the deserialized user object
	 */
	async pinUser(server: string, userObj: UserObjectType) {
		ProfilePinnedUserService.addForProfile(
			this.db,
			this.profile,
			this.acct,
			userObj,
		);
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

	async fetchInstanceData(server?: string): Promise<KnownServer | null> {
		const serverRecord = KnownServerService.getByUrl(this.db, server);
		if (serverRecord && serverRecord.driver !== KNOWN_SOFTWARE.UNKNOWN)
			return serverRecord;
		if (!serverRecord || serverRecord.driver === KNOWN_SOFTWARE.UNKNOWN) {
			const x = new BaseApiAdapter();
			const softwareInfoResult = await x.instances.getSoftwareInfo(server);
			if (softwareInfoResult.error) {
				console.log('[WARN]: failed to fetch server info', server);
				return null;
			}
			KnownServerService.upsert(this.db, {
				url: server,
				driver: softwareInfoResult.data.software,
			});
		}
		return KnownServerService.getByUrl(this.db, server);
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

		const has = this.cacheManager.getEmojis(_server);

		if (has) {
			const isExpired = new Date(has.lastFetchedAt) <= oneWeekAgo;
			const isEmpty = has.data.length === 0;
			if (!isExpired && !isEmpty) return has.data;
		}

		const serverRecord = await this.fetchInstanceData(_server);
		if (!serverRecord) return;
		const _url = serverRecord.server;

		const x = new BaseApiAdapter();
		const { data, error } = await x.instances.getCustomEmojis(_url);
		if (error) {
			console.log('[WARN]: failed to get emojis');
			return null;
		}

		this.cacheManager.setJson(`emojis/${_url}`, {
			data: data,
			lastFetchedAt: new Date(),
		});
		this.cacheManager.setEmojis(_url, data);
		if (this.acct.server === _server) {
		}
		return data;
	}
}

export default ProfileSessionManager;
