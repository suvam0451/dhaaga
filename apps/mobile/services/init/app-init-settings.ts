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
		let disableRemoteInstanceCalls =
			appSettingsKeys.privacy.advanced.disableRemoteInstanceCalls;

		let postInteractionPrefs = appSettingsKeys.preferences.post.interaction;
		let items = [
			disableRemoteInstanceCalls.ALL,
			disableRemoteInstanceCalls.PROFILE_CACHING,
			disableRemoteInstanceCalls.REACTION_CACHING,
			disableRemoteInstanceCalls.SOFTWARE_CACHING,
			disableRemoteInstanceCalls.INSTANCE_DETAILS,
			disableRemoteInstanceCalls.REMOTE_DATA_SYNC,
			disableRemoteInstanceCalls.REMOTE_TIMELINES,
			postInteractionPrefs.quickReaction,
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
