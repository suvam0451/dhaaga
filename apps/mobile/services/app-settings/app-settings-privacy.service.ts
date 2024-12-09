import { AppSettingsBase, appSettingsKeys } from './app-settings';
import { SQLiteDatabase } from 'expo-sqlite';

const NAMESPACE = appSettingsKeys.privacy;
class AppPrivacySettingsService extends AppSettingsBase {
	constructor(db: SQLiteDatabase) {
		super(db);
	}

	static override create(db: SQLiteDatabase) {
		return new AppPrivacySettingsService(db);
	}

	/**
	 * Cross-Instance Requests -- All
	 */
	disableCrossInstanceAllRequests(): boolean {
		return this.getBool(NAMESPACE.advanced.disableRemoteInstanceCalls.ALL);
	}

	/**
	 * Cross-Instance Requests -- System Triggered
	 */
	isDisabledCrossInstanceReactionCaching(): boolean {
		if (this.disableCrossInstanceAllRequests()) return true;
		return this.getBool(
			NAMESPACE.advanced.disableRemoteInstanceCalls.REACTION_CACHING,
		);
	}

	isDisabledCrossInstanceSoftwareCaching(): boolean {
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

export default AppPrivacySettingsService;
