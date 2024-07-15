import { ObjectSchema, Object, BSON } from 'realm';
import { z } from 'zod';

export const AppSettingCreateDTO = z.object({
	key: z.string(),
	value: z.string(),
});

export const AppSettingDTO = AppSettingCreateDTO.extend({
	_id: z.any(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export class AppSetting
	extends Object
	implements z.infer<typeof AppSettingCreateDTO>
{
	_id: BSON.UUID;
	key: string;
	value: string;
	createdAt: Date;
	updatedAt: Date;

	static schema: ObjectSchema = {
		name: 'AppSetting',
		primaryKey: '_id',
		properties: {
			_id: 'uuid',
			key: 'string',
			value: 'string',
			createdAt: {
				type: 'date',
				default: new Date(),
			},
			updatedAt: {
				type: 'date',
				default: new Date(),
			},
		},
	};
}
