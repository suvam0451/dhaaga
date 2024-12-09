import BaseRepository from './_base.repo';
import { z } from 'zod';
import { AppSetting } from '../entities/app-settings.entity';
import { APP_SETTINGS } from '../types/app.types';
import { SQLiteDatabase } from 'expo-sqlite';

// class AppProfileRepositoryImpl extends BaseRepository<
// 	AppProfile,
// 	z.infer<typeof AppProfileDTO>
// > {
// 	constructor(db: SQLiteDatabase) {
// 		super(db, AppProfile.schema.name, AppProfileDTO);
// 	}
//
// 	seedAppSettings(input: z.infer<typeof AppProfileCreateDTO>) {
// 		const match = this.findDuplicate(input.name);
// 		if (!match) return;
//
// 		const settings = [
// 			[APP_SETTINGS.TIMELINE_SENSITIVE_CONTENT, 'hide'],
// 			[APP_SETTINGS.TIMELINE_CONTENT_WARNING, 'show'],
// 		];
// 		this.db.write(() => {
// 			for (const setting of settings) {
// 				const foundSetting: AppSetting = match.settings.find(
// 					(o) => o.key === setting[0],
// 				);
// 				if (foundSetting) foundSetting.value = setting[1];
// 				else {
// 					const savedSetting = this.db.create(AppSetting, {
// 						_id: new Realm.BSON.UUID(),
// 						key: setting[0],
// 						value: setting[1],
// 						type: 'boolean',
// 					});
// 					match.settings.push(savedSetting);
// 				}
// 			}
// 		});
// 	}
//
// 	upsert(input: z.infer<typeof AppProfileCreateDTO>) {
// 		const match = this.findDuplicate(input.name);
// 		if (match) return match;
//
// 		return this.db.write(() => {
// 			return this.createImpl({
// 				_id: match?._id || new BSON.UUID(),
// 				name: match?.name || input.name,
// 				selected: false,
// 			});
// 		});
// 	}
//
// 	/**
// 	 * At least one profile should always be active.
// 	 *
// 	 * If none other are, Default should
// 	 */
// 	ensureDefaultProfileIsActive() {
// 		this.db.write(() => {
// 			const match = this.db
// 				.objects(AppProfile)
// 				.filter((o) => o.selected == true);
// 			if (match.length === 0) {
// 				const def: AppProfile = this.db
// 					.objects(AppProfile)
// 					.find((o: AppProfile) => o.name === 'Default');
// 				def.selected = true;
// 			}
// 		});
// 	}
//
// 	findDuplicate(name: string) {
// 		return this.db.objects(AppProfile).find((o: AppProfile) => o.name === name);
// 	}
// }
