import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import useGlobalState from './_global';
import { useShallow } from 'zustand/react/shallow';
import { useFonts } from '@expo-google-fonts/montserrat';
import appFonts from '../styles/AppFonts';

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
	// app will be covered with splash screen until everything is loaded
	const [AppReady, setAppReady] = useState(false);
	const [AccountReady, setAccountReady] = useState(true);
	const [ProfileReady, setProfileReady] = useState(false);

	const db = useSQLiteContext();
	const [fontsLoaded, fontError] = useFonts(appFonts);

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

	// load essential app data
	useEffect(() => {
		setAppReady(false);
		appInitialize(db);
		loadApp();
		setAppReady(true);
	}, [db]);

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

	const _appReady = fontsLoaded && !fontError && AppReady;

	return {
		appReady: _appReady,
		accountReady: AccountReady,
		profileReady: ProfileReady,
	};
}

export default useAppSession;
