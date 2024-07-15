import { BSON, Realm } from 'realm';
import {
	AppProfile,
	AppProfileCreateDTO,
	AppProfileDTO,
} from '../entities/app-profile.entity';
import BaseRepository from './_base.repo';
import { z } from 'zod';

class AppProfileRepositoryImpl extends BaseRepository<
	AppProfile,
	z.infer<typeof AppProfileDTO>
> {
	constructor(db: Realm) {
		super(db, AppProfile.schema.name, AppProfileDTO);
	}

	upsert(input: z.infer<typeof AppProfileCreateDTO>) {
		const match = this.findDuplicate(input.name);
		if (match) return match;

		return this.db.write(() => {
			return this.createImpl({
				_id: match?._id || new BSON.UUID(),
				name: match?.name || input.name,
				selected: false,
			});
		});
	}

	findDuplicate(name: string) {
		return this.db.objects(AppProfile).find((o: AppProfile) => o.name === name);
	}
}

export function AppProfileRepository(db: Realm) {
	return new AppProfileRepositoryImpl(db);
}
