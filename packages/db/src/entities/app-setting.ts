import { SQLiteDatabase } from 'expo-sqlite';
import { z } from 'zod';
import { DataSource } from '../dataSource';
import type { AppSetting } from '../_schema';

export const AppSettingCreateDTO = z.object({
	key: z.string(),
	value: z.string(),
	type: z.enum(['boolean', 'string', 'json', 'csv'] as const),
});

export type AppSettingType = z.infer<typeof AppSettingCreateDTO>;

class Repo {
	static async get(db: SQLiteDatabase, key: string) {}

	static async toggle(db: SQLiteDatabase, key: string) {}
}

class Service {
	static getValue<T>(db: DataSource, key: string): T | null {
		const setting = db.appSetting.findOne({
			key,
		});
		if (!setting) return null;

		try {
			switch (setting.type) {
				case 'boolean':
					return Boolean(setting.value) as T;
				case 'string':
					return setting.value as T;
				case 'json':
					return JSON.parse(setting.value as string) as T;
			}
		} catch (e) {
			console.log('[WARN]: error parsing setting');
			return null;
		}

		return null;
	}

	static toggle(db: DataSource, key: string): AppSetting | null {
		return null;
	}

	static setValue(db: DataSource, input: AppSettingType) {
		const conflict = db.appSetting.findOne({
			key: input.key,
		});
		if (conflict) {
			db.appSetting.updateById(conflict.id, {
				value:
					input.type === 'json'
						? JSON.stringify(input.value)
						: input.value.toString(),
				type: input.type,
			});
		} else {
			db.appSetting.insert({
				key: input.key,
				value:
					input.type === 'json'
						? JSON.stringify(input.value)
						: input.value.toString(),
				type: input.type,
			});
		}
	}

	static setValueNoUpsert(db: DataSource, input: AppSettingType) {
		const conflict = db.appSetting.findOne({
			key: input.key,
		});
		if (conflict) return;
		db.appSetting.insert({
			key: input.key,
			value:
				input.type === 'json'
					? JSON.stringify(input.value)
					: input.value.toString(),
			type: input.type,
		});
	}

	/**
	 * Responsible for ensuring
	 * all app settings are
	 * initialized anf defaulted properly
	 */
	static init(db: SQLiteDatabase) {}
}

export { Repo as AppSettingRepo, Service as AppSettingService };
