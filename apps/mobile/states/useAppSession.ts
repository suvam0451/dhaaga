import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import useGlobalState from './_global';
import { useShallow } from 'zustand/react/shallow';
import { useAppDb, useHub } from '../hooks/utility/global-state-extractors';
import SettingsService, { APP_SETTING_KEY } from '../services/settings.service';
import useAppSettings from '../features/settings/interactors/useAppSettings';
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
	// app will be covered with a splash screen until everything is loaded
	const [AppReady, setAppReady] = useState(false);
	const [AccountReady, setAccountReady] = useState(true);
	const [ProfileReady, setProfileReady] = useState(false);

	const db = useSQLiteContext();
	const { db: appDb } = useAppDb();
	const { getValue, setValue, setAppLangauge } = useAppSettings();
	const { i18n } = useTranslation();

	const {
		appInitialize,
		loadApp,
		db: loadedDb,
		loadActiveProfile,
		profileManager,
	} = useGlobalState(
		useShallow((o) => ({
			appInitialize: o.appInitialize,
			loadApp: o.loadApp,
			db: o.db,
			acct: o.acct,
			loadActiveProfile: o.loadActiveProfile,
			profileManager: o.profileSessionManager,
		})),
	);
	const { loadAccounts } = useHub();

	// load essential app data
	useEffect(() => {
		setAppReady(false);
		appInitialize(db);
		loadApp();
		loadAccounts();
		setAppReady(true);
	}, [db]);

	// load settings
	useEffect(() => {
		if (!appDb) return;
		SettingsService.init(appDb);
		const lang = getValue<string>(APP_SETTING_KEY.APP_LANGUAGE);
		if (lang) i18n.changeLanguage(lang);
	}, [appDb]);

	// load essential account data
	useEffect(() => {
		setAccountReady(false);
		if (!loadedDb) return;
		loadActiveProfile();
		setAccountReady(true);
	}, [loadedDb]);

	// load essential profile data
	useEffect(() => {
		if (!profileManager || ProfileReady) return;
		profileManager
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
	}, [profileManager]);

	return {
		appReady: AppReady,
		accountReady: AccountReady,
		profileReady: ProfileReady,
	};
}

export default useAppSession;
