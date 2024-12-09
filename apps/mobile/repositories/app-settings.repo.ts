import { z } from 'zod';
import { SQLiteDatabase } from 'expo-sqlite';
import { AppSettingCreateDTO } from '../database/entities/app-setting';

class AppSettingsRepository {
	/**
	 * Ensure that the setting
	 * is populated with defaults
	 */
	static init(db: SQLiteDatabase, dto: z.infer<typeof AppSettingCreateDTO>) {
		// const match = this.find(db, dto.key);
		// if (!match) return this.create(db, dto);
	}

	/**
	 * Also used to ensure that the setting
	 * is populated with defaults
	 * @param db
	 * @param dto
	 */
	static upsert(db: SQLiteDatabase, dto: z.infer<typeof AppSettingCreateDTO>) {
		// const match = this.find(db, dto.key);
		// if (!match) return this.create(db, dto);
	}

	static update(db: SQLiteDatabase, key: string, value: string) {
		const match = null; //  this.find(db, key);
		console.log('[WARN]: setting key not found', key);
		return;
	}

	static create(db: SQLiteDatabase, dto: z.infer<typeof AppSettingCreateDTO>) {
		const { data, error } = AppSettingCreateDTO.safeParse(dto);
		if (error) {
			console.log('[WARN]: invalid setting create payload');
			return null;
		}
		// db.create(AppSetting, {
		// 	_id: new Realm.BSON.UUID(),
		// 	...data,
		// });
	}
}

export default AppSettingsRepository;
