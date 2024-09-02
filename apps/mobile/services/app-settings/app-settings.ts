import { Realm } from 'realm';
import AppSettingsRepository from '../../repositories/app-settings.repo';

export enum REMOTE_INSTANCE_CALL_SETTINGS {
	PRIVACY_ADVANCED_REMOTE_INSTANCE_CALLS_ALL = 'privacy.advanced.remoteInstanceCalls.all',
	PRIVACY_ADVANCED_REMOTE_INSTANCE_CALLS_REACTIONS = 'privacy.advanced.remoteInstanceCalls.reactions',
}

export const appSettingsKeys = {
	privacy: {
		advanced: {
			disableRemoteInstanceCalls: {
				ALL: 'privacy.advanced.disableRemoteInstanceCalls.all',
				// System Triggered
				REACTION_CACHING:
					'privacy.advanced.disableRemoteInstanceCalls.reactionCaching',
				SOFTWARE_CACHING:
					'privacy.advanced.disableRemoteInstanceCalls.softWareCaching',
				PROFILE_CACHING:
					'privacy.advanced.disableRemoteInstanceCalls.profileCaching',
				// Manually Triggered
				INSTANCE_DETAILS:
					'privacy.advanced.disableRemoteInstanceCalls.instanceDetails',
				REMOTE_TIMELINES:
					'privacy.advanced.disableRemoteInstanceCalls.remoteTimelines',
				REMOTE_DATA_SYNC:
					'privacy.advanced.disableRemoteInstanceCalls.remoteDataSync',
			},
		},
	},
	preferences: {
		composer: {
			visibility: {},
		},
	},
};

class AppSettingService {
	static update(db: Realm, key: string, value: string) {
		db.write(() => {
			AppSettingsRepository.update(db, key, value);
		});
	}
}

export default AppSettingService;
