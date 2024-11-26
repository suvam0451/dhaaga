// import { Realm } from 'realm';
import {
	AppSetting,
	AppSettingCreateDTO,
} from '../entities/app-settings.entity';
import { z } from 'zod';

class AppSettingsRepository {
	/**
	 * Ensure that the setting
	 * is populated with defaults
	 */
	static init(db, dto: z.infer<typeof AppSettingCreateDTO>) {
		const match = this.find(db, dto.key);
		if (!match) return this.create(db, dto);
	}

	/**
	 * Also used to ensure that the setting
	 * is populated with defaults
	 * @param db
	 * @param dto
	 */
	static upsert(db, dto: z.infer<typeof AppSettingCreateDTO>) {
		const match = this.find(db, dto.key);
		if (!match) return this.create(db, dto);
	}

	static update(db, key: string, value: string) {
		const match = this.find(db, key);
		if (!match) {
			console.log('[WARN]: setting key not found', key);
			return;
		}
		match.value = value;
	}

	static create(db, dto: z.infer<typeof AppSettingCreateDTO>) {
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

	static find(db: Realm, key: string) {
		return db.objects(AppSetting).find((o) => o.key === key);
	}
}

export default AppSettingsRepository;
