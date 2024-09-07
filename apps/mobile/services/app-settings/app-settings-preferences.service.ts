import { Realm } from '@realm/react';
import { AppSettingsBase, appSettingsKeys } from './app-settings';

const NAMESPACE = appSettingsKeys.preferences;
class AppSettingsPreferencesService extends AppSettingsBase {
	constructor(db: Realm) {
		super(db);
	}

	static override create(db: Realm) {
		return new AppSettingsPreferencesService(db);
	}

	isQuickReactionEnabled(): boolean {
		return this.getBool(NAMESPACE.post.interaction.quickReaction);
	}

	isQuickBoostEnabled(): boolean {
		return this.getBool(NAMESPACE.post.interaction.quickBoost);
	}
}

export default AppSettingsPreferencesService;
