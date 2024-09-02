import { Realm } from 'realm';
import AppSettingsRepository from '../../repositories/app-settings.repo';
import { appSettingsKeys } from '../app-settings/app-settings';

let BOOLEAN_DEFAULT: { type: 'boolean' | 'string' | 'json'; value: string } = {
	type: 'boolean',
	value: '0',
};

/**
 * Responsible for ensuring
 * all app settings are
 * initialized anf defaulted properly
 */
class AppInitSettings {
	static run(db: Realm) {
		/**
		 * Privacy -- Advanced -- Remote Instance Calls
		 */
		let namespace = appSettingsKeys.privacy.advanced.disableRemoteInstanceCalls;
		let items = [
			namespace.ALL,
			namespace.PROFILE_CACHING,
			namespace.REACTION_CACHING,
			namespace.SOFTWARE_CACHING,
			namespace.INSTANCE_DETAILS,
			namespace.REMOTE_DATA_SYNC,
			namespace.REMOTE_TIMELINES,
		];

		db.write(() => {
			items.forEach((item) => {
				AppSettingsRepository.init(db, {
					...BOOLEAN_DEFAULT,
					key: item,
				});
			});
		});
	}
}

export default AppInitSettings;
