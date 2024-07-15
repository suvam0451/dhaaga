import { Realm } from '@realm/react';

class AppInitializationService {
	private setupDefaultProfile(db: Realm) {
		db.write(() => {});
	}
}

export default AppInitializationService;
