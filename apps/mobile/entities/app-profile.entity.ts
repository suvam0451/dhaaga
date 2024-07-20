import { List, ObjectSchema, Object } from 'realm';
import { AppSetting } from './app-settings.entity';
import { z } from 'zod';

export const AppProfileCreateDTO = z.object({
	name: z.string(),
});

export const AppProfileDTO = AppProfileCreateDTO.extend({
	_id: z.any(),
	selected: z.boolean(),
});

export class AppProfile extends Object {
	_id: Realm.BSON.UUID;
	name: string;
	selected: boolean;
	settings: List<AppSetting>;

	static schema: ObjectSchema = {
		name: 'AppProfile',
		primaryKey: '_id',
		properties: {
			_id: 'uuid',
			name: 'string',
			selected: {
				type: 'bool',
				default: false,
			},
			settings: `AppSetting[]`,
		},
	};
}
