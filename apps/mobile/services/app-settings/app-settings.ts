import { Realm } from '@realm/react';
import AppSettingsRepository from '../../repositories/app-settings.repo';
import { AppSetting } from '../../entities/app-settings.entity';

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
		post: {
			interaction: {
				quickReaction: 'privacy.preferences.post.interaction.quickReaction',
				quickBoost: 'privacy.preferences.post.interaction.quickBoost',
				quickBoostVisibility:
					'privacy.preferences.post.interaction.quickBoostVisibility',
			},
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

export class AppSettingsBase {
	db: Realm;
	settings: AppSetting[];
	constructor(db: Realm) {
		this.db = db;
	}

	protected getBool(key: string): boolean {
		const match = AppSettingsRepository.find(this.db, key);
		if (!match) return false;
		return match.value === '1';
	}

	refresh() {
		this.settings = this.db.objects(AppSetting);
	}
}

export default AppSettingService;
