import { KnownServer } from '../_schema';
import { DbErrorHandler } from './_base.repo';
import { KNOWN_SOFTWARE, UnknownRestClient } from '@dhaaga/bridge';
import { DataSource } from '../dataSource';
import { RandomUtil } from '../../utils/random.utils';

export type ServerRecordType = {
	driver: string;
	url: string;
};

/**
 * List of recognised server metadata
 */
export enum SERVER_METADATA_KEY {
	DESCRIPTION = 'description',
	SERVER_NAME = 'serverName',
	SERVER_SOFTWARE = 'serverSoftware',
	SOFTWARE_VERSION = 'softwareVersion',
	ICON_URL = 'iconUrl',
	FAVICON_URL = 'faviconUrl',
	THEME_COLOR = 'themeColor',
	NODEINFO = 'nodeInfo',
	NODEINFO_LAST_FETCHED_AT = 'nodeInfoLastFetchedAt',
	NODEINFO_LAST_ATTEMPT_AT = 'nodeinfoLastAttemptAt',
	CUSTOM_EMOJIS_LAST_FETCHED_AT = 'customEmojisLastFetchedAt',
	CUSTOM_EMOJIS_LAST_ATTEMPT_AT = 'customEmojisLastAttemptAt',
	// five retries, followed by one day cooldown
	CUSTOM_EMOJIS_FETCH_RETRY_COUNT = 'customEmojisFetchRetryCount',
}

export type ProfileKnownServerMetadataRecordType = {
	key: string;
	value: string;
	type: 'string';
};

@DbErrorHandler()
class Repo {
	static findByProfileAndUrl(db: DataSource, server: string) {
		return db.knownServer.findOne({
			server,
		});
	}

	static upsert(db: DataSource, input: ServerRecordType): KnownServer {
		const conflict = Repo.findByProfileAndUrl(db, input.url);

		if (conflict) {
			Repo.updateDriver(db, conflict.id, input.driver);
		} else {
			db.knownServer.insert({
				uuid: RandomUtil.nanoId(),
				server: input.url,
				driver: input.driver,
			});
		}
		return Repo.findByProfileAndUrl(db, input.url);
	}

	static updateDriver(db: DataSource, id: number, driver: string) {
		db.knownServer.update(
			{ id },
			{
				driver,
			},
		);
	}
	static upsertMeta(
		db: DataSource,
		id: number,
		input: ProfileKnownServerMetadataRecordType,
	) {
		const conflict = db.knownServerMetadata.findOne({
			knownServerId: id,
			key: input.key,
		});
		if (conflict) {
			db.knownServerMetadata.updateById(conflict.id, {
				value: input.value,
				type: 'string',
			});
		} else {
			db.knownServerMetadata.insert(input);
		}
	}
}

export class Service {
	static upsertMeta(
		db: DataSource,
		server: KnownServer,
		data: ProfileKnownServerMetadataRecordType,
	) {
		return Repo.upsertMeta(db, server.id, data);
	}
	static upsert(db: DataSource, input: ServerRecordType) {
		return Repo.upsert(db, input);
	}

	static getByUrl(db: DataSource, url: string) {
		url = url.replace(/^https?:\/\//, '');
		return Repo.findByProfileAndUrl(db, url);
	}

	static updateDriver(
		db: DataSource,
		server: KnownServer,
		driver: KNOWN_SOFTWARE | string,
	) {
		return Repo.updateDriver(db, server.id, driver.toString());
	}

	static async syncDriver(db: DataSource, url: string, force = false) {
		let match = Service.getByUrl(db, url);
		const x = new UnknownRestClient();
		if (!match || force) {
			const instanceResult = await x.instances.getNodeInfo(url);
			if (instanceResult.error) return;

			const driverGetResult = await x.instances.getSoftware(
				instanceResult.data,
			);
			if (driverGetResult.error) {
				console.log('[ERROR]: failed to get driver details for', url);
				return;
			}
		}
	}
}

export { Repo as KnownServerRepo, Service as KnownServerService };
