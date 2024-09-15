import { Realm } from 'realm';
import AppInitSettings from './app-init-settings';

class AppInit {
	db: Realm;
	constructor(db: Realm) {
		this.db = db;
	}

	/**
	 * Apply Default Settings
	 */
	applyDefaultSettings() {
		AppInitSettings.run(this.db);
		return this;
	}

	static create(db: Realm) {
		return new AppInit(db);
	}
}

export default AppInit;
