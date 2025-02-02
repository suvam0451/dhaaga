import { AppSetting } from '../../database/_schema';
import { SQLiteDatabase } from 'expo-sqlite';
import { AppSettingService } from '../../database/entities/app-setting';

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

export class AppSettingsBase {
	db: SQLiteDatabase;
	settings: AppSetting[];
	constructor(db: SQLiteDatabase) {
		this.db = db;
	}

	static create(db: SQLiteDatabase) {
		return new AppSettingsBase(db);
	}

	protected getBool(key: string): boolean {
		const match = AppSettingService.getValue(this.db, key);
		if (!match) return false;
		return Boolean(match.value) == true;
	}
}
