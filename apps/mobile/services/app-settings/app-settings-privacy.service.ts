import { Realm } from '@realm/react';
import { AppSetting } from '../../entities/app-settings.entity';
import { appSettingsKeys } from './app-settings';
import AppSettingsRepository from '../../repositories/app-settings.repo';

const NAMESPACE = appSettingsKeys.privacy;
class AppPrivacySettings {
	db: Realm;
	settings: AppSetting[];
	constructor(db: Realm) {
		this.db = db;
	}

	refresh() {
		this.settings = this.db.objects(AppSetting);
	}

	/**
	 * Cross-Instance Requests -- All
	 */
	disableCrossInstanceAllRequests(): boolean {
		const match = AppSettingsRepository.find(
			this.db,
			NAMESPACE.advanced.disableRemoteInstanceCalls.ALL,
		);
		if (!match) return false;
		return match.value === '1';
	}

	private getBool(key: string): boolean {
		const match = AppSettingsRepository.find(this.db, key);
		if (!match) return false;
		return match.value === '1';
	}

	/**
	 * Cross-Instance Requests -- System Triggered
	 */
	disableCrossInstanceReactionCaching(): boolean {
		if (this.disableCrossInstanceAllRequests()) return true;
		return this.getBool(
			NAMESPACE.advanced.disableRemoteInstanceCalls.REACTION_CACHING,
		);
	}

	disableCrossInstanceSoftwareCaching(): boolean {
		if (this.disableCrossInstanceAllRequests()) return true;
		return this.getBool(
			NAMESPACE.advanced.disableRemoteInstanceCalls.SOFTWARE_CACHING,
		);
	}

	disableCrossInstanceProfileCaching(): boolean {
		if (this.disableCrossInstanceAllRequests()) return true;
		return this.getBool(
			NAMESPACE.advanced.disableRemoteInstanceCalls.PROFILE_CACHING,
		);
	}

	/**
	 * Cross-Instance Requests -- System Triggered
	 */
	disableCrossInstanceFetchInstanceDetails(): boolean {
		if (this.disableCrossInstanceAllRequests()) return true;
		return this.getBool(
			NAMESPACE.advanced.disableRemoteInstanceCalls.INSTANCE_DETAILS,
		);
	}

	disableCrossInstanceFetchRemoteTimelines(): boolean {
		if (this.disableCrossInstanceAllRequests()) return true;
		return this.getBool(
			NAMESPACE.advanced.disableRemoteInstanceCalls.REMOTE_TIMELINES,
		);
	}

	disableCrossInstanceRemoteDataSync(): boolean {
		if (this.disableCrossInstanceAllRequests()) return true;
		return this.getBool(
			NAMESPACE.advanced.disableRemoteInstanceCalls.REMOTE_DATA_SYNC,
		);
	}
}

export default AppPrivacySettings;
