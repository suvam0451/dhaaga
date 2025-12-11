import { AppPublisherService } from '#/services/publishers/app.publisher';
import { Account, AccountService, DataSource } from '@dhaaga/db';
import AppSessionManager from '#/states/sessions/app-session.service';
import { SQLiteDatabase } from 'expo-sqlite';
import {
	AppStateImmerGetObject,
	AppStateImmerSetObject,
} from '#/states/global/typings';

export type AppStateAppSessionState = {
	db: DataSource | null;
	appManager: AppSessionManager | null;
	appEventBus: AppPublisherService;
};

export type AppStateAppSessionActions = {
	appInit: (db: SQLiteDatabase) => void;
	loadAccount: (acct: Account) => Promise<void>;
};

function createAppSessionSlice(
	set: AppStateImmerSetObject,
	get: AppStateImmerGetObject,
): AppStateAppSessionState & AppStateAppSessionActions {
	return {
		/**
		 * ---- STATE ----
		 */

		db: null,
		appManager: null,
		appEventBus: null,

		/**
		 * ---- ACTIONS ----
		 */

		appInit: (db: SQLiteDatabase) => {
			set((state) => {
				const _db = new DataSource(db);
				state.appSession.db = _db;
				state.appSession.appManager = new AppSessionManager(_db);
				state.appSession.appEventBus = new AppPublisherService();
			});
		},
		loadAccount: async (acct: Account) => {
			if (get().userSession.acct?.id === acct.id) return;
			set((state) => {
				AccountService.select(get().appSession.db, acct);
			});

			await get().userSession.restoreSession(acct);
		},
	};
}

export default createAppSessionSlice;
