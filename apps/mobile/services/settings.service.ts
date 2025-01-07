import * as Localization from 'expo-localization';
import { DataSource } from '../database/dataSource';
import { AppSettingService } from '../database/entities/app-setting';

export enum APP_SETTING_KEY {
	SYSTEM_LOCALE = 'appSetting_systemLocale',
	USER_LOCALE = 'appSetting_userLocale',
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
		}
	}
}

export default SettingsService;
