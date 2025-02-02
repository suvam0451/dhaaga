import { SQLiteDatabase } from 'expo-sqlite';
import { z } from 'zod';
import { AppSetting } from '../../database/_schema';
import { appSettingsKeys } from '../../services/app-settings/app-settings';
import AppSettingsRepository from '../../repositories/app-settings.repo';
import { DataSource } from '../dataSource';

let BOOLEAN_DEFAULT: {
	type: 'boolean' | 'string' | 'json' | 'csv';
	value: string;
} = {
	type: 'boolean',
	value: '0',
};

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
	static getValue<T>(db: DataSource, key: string): T {
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

	static async toggle(db: DataSource, key: string): Promise<AppSetting> {
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
	static init(db: SQLiteDatabase) {
		/**
		 * Privacy -- Advanced -- Remote Instance Calls
		 */
		let disableRemoteInstanceCalls =
			appSettingsKeys.privacy.advanced.disableRemoteInstanceCalls;

		let postInteractionPrefs = appSettingsKeys.preferences.post.interaction;
		let items = [
			disableRemoteInstanceCalls.ALL,
			disableRemoteInstanceCalls.PROFILE_CACHING,
			disableRemoteInstanceCalls.REACTION_CACHING,
			disableRemoteInstanceCalls.SOFTWARE_CACHING,
			disableRemoteInstanceCalls.INSTANCE_DETAILS,
			disableRemoteInstanceCalls.REMOTE_DATA_SYNC,
			disableRemoteInstanceCalls.REMOTE_TIMELINES,
			postInteractionPrefs.quickReaction,
		];

		items.forEach((item) => {
			AppSettingsRepository.init(db, {
				...BOOLEAN_DEFAULT,
				key: item,
			});
		});
	}
}

export { Repo as AppSettingRepo, Service as AppSettingService };
