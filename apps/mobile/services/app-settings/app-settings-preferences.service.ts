import { AppSettingsBase, appSettingsKeys } from './app-settings';
import { SQLiteDatabase } from 'expo-sqlite';

const NAMESPACE = appSettingsKeys.preferences;
class AppSettingsPreferencesService extends AppSettingsBase {
	constructor(db) {
		super(db);
	}

	static override create(db: SQLiteDatabase) {
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
