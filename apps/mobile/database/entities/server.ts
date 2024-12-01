import { Server } from '../_schema';
import { DbErrorHandler } from './_base.repo';
import { SQLiteDatabase } from 'expo-sqlite';
import { withSuccess } from '../../utils/result';
import {
	KNOWN_SOFTWARE,
	UnknownRestClient,
} from '@dhaaga/shared-abstraction-activitypub';

export type ServerRecordType = {
	description: string;
	driver: string;
	url: string;
};

@DbErrorHandler()
class Repo {
	static async getByUrl(db: SQLiteDatabase, url: string) {
		const match = await db.getFirstAsync<Server>(
			`select * from server where url = ?;`,
			url,
		);
		return withSuccess(match);
	}

	static async upsert(
		db: SQLiteDatabase,
		input: ServerRecordType,
	): Promise<Server> {
		await db.runAsync(
			`insert into server (url, driver, description) values (?, ?, ?)`,
			input.url,
			input.driver,
			input.description || 'N/A',
		);
		return null;
	}

	static async updateDriver(
		db: SQLiteDatabase,
		serverId: number,
		driver: string,
	) {
		await db.runAsync(
			`update server set driver = ? where id = ?`,
			driver,
			serverId,
		);
	}
}

export class Service {
	static async upsert(db: SQLiteDatabase, input: ServerRecordType) {
		return Repo.upsert(db, input);
	}

	static async getByUrl(db: SQLiteDatabase, url: string) {
		url = url.replace(/^https?:\/\//, '');
		return Repo.getByUrl(db, url);
	}

	static async updateDriver(
		db: SQLiteDatabase,
		server: Server,
		driver: KNOWN_SOFTWARE | string,
	) {
		return Repo.updateDriver(db, server.id, driver.toString());
	}

	static async syncDriver(db: SQLiteDatabase, url: string, force = false) {
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
		} else {
		}
	}
}

export { Repo as ServerRepo, Service as ServerService };
