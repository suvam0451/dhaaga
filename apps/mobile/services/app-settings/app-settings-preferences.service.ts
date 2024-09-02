import { Realm } from '@realm/react';
import { AppSettingsBase, appSettingsKeys } from './app-settings';

const NAMESPACE = appSettingsKeys.preferences;
class AppSettingsPreferencesService extends AppSettingsBase {
	constructor(db: Realm) {
		super(db);
	}

	isQuickReactionEnabled(): boolean {
		return this.getBool(NAMESPACE.post.interaction.quickReaction);
	}
}

export default AppSettingsPreferencesService;
