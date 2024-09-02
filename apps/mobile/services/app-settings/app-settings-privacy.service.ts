import { Realm } from '@realm/react';
import { AppSettingsBase, appSettingsKeys } from './app-settings';

const NAMESPACE = appSettingsKeys.privacy;
class AppPrivacySettings extends AppSettingsBase {
	constructor(db: Realm) {
		super(db);
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