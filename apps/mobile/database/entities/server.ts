import {
	AccountProfile,
	ProfileKnownServer,
	ProfileKnownServerMetadata,
} from '../_schema';
import { DbErrorHandler } from './_base.repo';
import {
	KNOWN_SOFTWARE,
	UnknownRestClient,
} from '@dhaaga/shared-abstraction-activitypub';
import { DataSource } from '../dataSource';
import { RandomUtil } from '../../utils/random.utils';

export type ServerRecordType = {
	description: string;
	driver: string;
	url: string;
};

@DbErrorHandler()
class Repo {
	static findByProfileAndUrl(db: DataSource, profileId: number, url: string) {
		return db.profileKnownServer.findOne({
			profileId,
			url,
		});
	}

	static upsert(
		db: DataSource,
		profileId: number,
		input: ServerRecordType,
	): ProfileKnownServer {
		const conflict = Repo.findByProfileAndUrl(db, profileId, input.url);

		if (conflict) {
			Repo.updateDriver(db, conflict.id, input.driver);
		} else {
			db.profileKnownServer.insert({
				uuid: RandomUtil.nanoId(),
				url: input.url,
				driver: input.driver,
				profileId,
			});
		}
		return Repo.findByProfileAndUrl(db, profileId, input.url);
	}

	static updateDriver(db: DataSource, id: number, driver: string) {
		db.profileKnownServer.update(
			{ id },
			{
				driver,
			},
		);
	}
}

export class Service {
	static upsert(
		db: DataSource,
		profile: AccountProfile,
		input: ServerRecordType,
	) {
		return Repo.upsert(db, profile.id, input);
	}

	static getByUrl(db: DataSource, profile: AccountProfile, url: string) {
		url = url.replace(/^https?:\/\//, '');
		return Repo.findByProfileAndUrl(db, profile.id, url);
	}

	static updateDriver(
		db: DataSource,
		server: ProfileKnownServer,
		driver: KNOWN_SOFTWARE | string,
	) {
		return Repo.updateDriver(db, server.id, driver.toString());
	}

	static async syncDriver(
		db: DataSource,
		profile: AccountProfile,
		url: string,
		force = false,
	) {
		let match = Service.getByUrl(db, profile, url);
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

export { Repo as ServerRepo, Service as ServerService };
