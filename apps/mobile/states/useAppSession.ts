import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import {
	useAccountManager,
	useAppDb,
	useAppTheme,
	useHub,
	useSessionManagement,
} from './global/hooks';
import SettingsService, { APP_SETTING_KEY } from '../services/settings.service';
import useAppSettings from '../hooks/app/useAppSettings';
import { useTranslation } from 'react-i18next';

/**
 * Responsible for ensuring all
 * necessary internal/external
 * dependencies are loading for
 * app/account/profile session
 *
 * This hook is sits at the top level
 * of expo-router, wrapped with ll
 * the required contexts
 */
function useAppSession() {
	// the app will be covered with a splash screen until everything is loaded
	const [AppReady, setAppReady] = useState(false);
	const [ProfileReady, setProfileReady] = useState(false);

	const db = useSQLiteContext();
	const { getValue } = useAppSettings();
	const { i18n } = useTranslation();

	const { db: loadedDb } = useAppDb();
	const { appInit, restoreSession } = useSessionManagement();
	const { acctManager } = useAccountManager();
	const { loadAccounts } = useHub();
	const { loadSkinFromMemory } = useAppTheme();

	// load essential app data
	useEffect(() => {
		if (!db) return;
		setAppReady(false);
		appInit(db);
		restoreSession();
		loadAccounts();
		loadSkinFromMemory();
		setAppReady(true);
	}, [db]);

	// load settings
	useEffect(() => {
		if (!loadedDb) return;
		SettingsService.init(loadedDb);
		const lang = getValue<string>(APP_SETTING_KEY.APP_LANGUAGE);
		if (lang) i18n.changeLanguage(lang);
	}, [loadedDb]);

	// load essential profile data
	useEffect(() => {
		if (!acctManager || ProfileReady) return;
		acctManager
			.loadCustomEmojis(true)
			.then(() => {
				console.log('[NOTE]: loaded instance emojis');
			})
			.catch((e) => {
				console.log('[WARN]: profile manager failed to load essential data', e);
			})
			.finally(() => {
				setProfileReady(true);
			});
	}, [acctManager]);

	return AppReady;
}

export default useAppSession;
