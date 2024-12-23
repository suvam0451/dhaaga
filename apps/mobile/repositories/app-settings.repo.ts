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
}

export default AppSettingsRepository;
