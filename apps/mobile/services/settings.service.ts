import * as Localization from 'expo-localization';
import { DataSource } from '../database/dataSource';
import { AppSettingService } from '../database/entities/app-setting';

export enum APP_SETTING_KEY {
	SYSTEM_LOCALE = 'appSetting_systemLocale',
	USER_LOCALE = 'appSetting_userLocale',
	APP_LANGUAGE = 'appSetting_language_appLanguage',
	CONTENT_LANGUAGES = 'appSetting_language_contentLanguages',
}

class SettingsService {
	static init(db: DataSource) {
		const systemLanguage = Localization.getLocales()[0].languageCode;
		if (typeof systemLanguage === 'string') {
			AppSettingService.setValue(db, {
				key: APP_SETTING_KEY.SYSTEM_LOCALE,
				value: systemLanguage,
				type: 'string',
			});
			AppSettingService.setValueNoUpsert(db, {
				key: APP_SETTING_KEY.USER_LOCALE,
				value: systemLanguage,
				type: 'string',
			});
			AppSettingService.setValueNoUpsert(db, {
				key: APP_SETTING_KEY.APP_LANGUAGE,
				value: systemLanguage,
				type: 'string',
			});
			AppSettingService.setValueNoUpsert(db, {
				key: APP_SETTING_KEY.CONTENT_LANGUAGES,
				value: systemLanguage,
				type: 'string',
			});
		}
	}
}

export default SettingsService;
