import { APP_SETTING_KEY } from '../../../services/settings.service';
import {
	AppSettingService,
	AppSettingType,
} from '../../../database/entities/app-setting';
import { useAppDb } from '../../../hooks/utility/global-state-extractors';
import { useState } from 'react';
import { RandomUtil } from '../../../utils/random.utils';

function useAppSettings() {
	const [Hash, setHash] = useState(RandomUtil.nanoId());
	const { db } = useAppDb();
	function getValue<T>(key: APP_SETTING_KEY) {
		return AppSettingService.getValue<T>(db, key);
	}

	function refresh() {
		setHash(RandomUtil.nanoId());
	}

	function setValue(dto: AppSettingType) {
		AppSettingService.setValue(db, dto);
		refresh();
	}

	function setAppLangauge(languageCode: string) {
		setValue({
			key: APP_SETTING_KEY.APP_LANGUAGE,
			value: languageCode,
			type: 'string',
		});
	}

	return { getValue, setValue, hash: Hash, setAppLangauge };
}

export default useAppSettings;
