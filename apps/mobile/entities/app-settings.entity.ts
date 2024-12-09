import { z } from 'zod';
import { AppSettingCreateDTO } from '../database/entities/app-setting';

export type AppSettingCreateDTOType = z.infer<typeof AppSettingCreateDTO>;

export const AppSettingDTO = AppSettingCreateDTO.extend({
	_id: z.any(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export class AppSetting
	extends Object
	implements z.infer<typeof AppSettingCreateDTO>
{
	// _id: BSON.UUID;
	key: string;
	value: string;
	type: 'string' | 'boolean' | 'json';
	createdAt: Date;
	updatedAt: Date;

	// static schema: ObjectSchema = {
	// 	name: 'AppSetting',
	// 	primaryKey: '_id',
	// 	properties: {
	// 		_id: 'uuid',
	// 		key: 'string',
	// 		value: 'string',
	// 		type: 'string',
	// 		createdAt: {
	// 			type: 'date',
	// 			default: new Date(),
	// 		},
	// 		updatedAt: {
	// 			type: 'date',
	// 			default: new Date(),
	// 		},
	// 	},
	// };
}
