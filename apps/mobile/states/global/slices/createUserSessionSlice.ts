import ProfileSessionManager from '#/states/sessions/profile-session.service';
import AccountSessionManager from '#/states/sessions/account-session.service';
import { Account, AccountService, Profile } from '@dhaaga/db';
import {
	ApiTargetInterface,
	KNOWN_SOFTWARE,
	type UserObjectType,
} from '@dhaaga/bridge';
import { AppSessionService } from '#/services/app-session.service';
import {
	AppStateImmerGetObject,
	AppStateImmerSetObject,
} from '#/states/global/typings';
import { PostPublisherService } from '#/services/publishers/post.publisher';

export type AppStateUserSessionState = {
	state: 'idle' | 'loading' | 'valid' | 'invalid' | 'no-account';
	target: Account | null;
	acct: Account | null;
	profile: Profile | null;
	acctManager: AccountSessionManager | null;
	profileManager: ProfileSessionManager | null;
	me: UserObjectType | null;
	error?: string;
	logs: string[];
	client: ApiTargetInterface;
	driver: KNOWN_SOFTWARE;
	server: string;

	postEventBus: PostPublisherService;
	userEventBug: PostPublisherService;
	tagEventBus: PostPublisherService;
};

const DEFAULT_STATE: AppStateUserSessionState = {
	state: 'no-account',
	target: null,
	acct: null,
	profile: null,
	me: null,
	acctManager: null,
	profileManager: null,
	client: null,
	server: null,
	driver: KNOWN_SOFTWARE.UNKNOWN,
	logs: [],

	postEventBus: null,
	userEventBug: null,
	tagEventBus: null,
};

export type AppStateUserSessionActions = {
	/**
	 * Restores the session for the active user.
	 *
	 * - loads an account if none is selected
	 * - loads+upserts the active profile
	 * - also usable to switch accounts
	 * - sets up error details in failure case
	 *
	 * Use this after switching to another
	 * account, or when the app restarts.
	 *
	 * A manual refresh will always refetch the
	 * account details (me object), while the
	 * default has a 24-hour cache timeout.
	 *
	 * @param targetAcct is the target account
	 * @param updateCache will always refetch the
	 * account details
	 */
	restoreSession: (
		targetAcct?: Account,
		updateCache?: boolean,
	) => Promise<void>;
};

function createUserSessionSlice(
	set: AppStateImmerSetObject,
	get: AppStateImmerGetObject,
): AppStateUserSessionState & AppStateUserSessionActions {
	return {
		/**
		 * ---- State ----
		 */

		...DEFAULT_STATE,
		state: 'idle' as 'idle' | 'loading' | 'valid' | 'invalid',

		/**
		 * ---- Actions ----
		 */

		restoreSession: async (targetAcct?: Account, updateCache?: boolean) => {
			const _db = get().appSession.db;
			if (!_db) return;

			const acct =
				targetAcct === undefined
					? AccountService.getSelected(_db)
					: AccountService.getById(_db, targetAcct.id);

			/**
			 * A) No account onboarded
			 * B) No account selected
			 */
			if (!acct) {
				const totalAccounts = AccountService.getAll(_db).length;

				set((state) => {
					state.userSession = {
						...state.userSession,
						...DEFAULT_STATE,
						error:
							totalAccounts === 0
								? 'No accounts found. Please add an account to continue.'
								: 'No account is selected. Please select an account to continue.',
					};
				});
				return;
			}

			/**
			 * Indicate loading status while
			 * retaining the acct/profile/me
			 * information from last session
			 */
			set((state) => {
				state.userSession = {
					...state.userSession,
					state: 'loading',
					target: acct ?? null,
					logs: [],
				};
			});

			// load default profile/account
			const x = new ProfileSessionManager(get().appSession.db!);
			if (!x.acct || !x.profile) return;

			try {
				const { acct, router, me } =
					await AppSessionService.restoreAppSession(_db);
				console.log('restored app session', acct, me);

				/**
				 * Success State
				 */
				set((state) => {
					state.userSession = {
						...state.userSession,
						state: 'valid',
						target: acct,
						acct,
						me: me,
						logs: [],
						client: router,
						driver: router.driver,
						server: router.server,
						acctManager: new AccountSessionManager(_db, acct),
						profileManager: new ProfileSessionManager(_db),

						postEventBus: new PostPublisherService(router),
						userEventBug: new PostPublisherService(router),
						tagEventBus: new PostPublisherService(router),
					};
				});
			} catch (e) {
				/**
				 * Unknown Failure State
				 */
				set((state) => {
					state.userSession = {
						...state.userSession,
						state: 'invalid',
						...DEFAULT_STATE,
						error: `[ERROR]: failed to restore app session. ${e.message}`,
					};
				});
			}
		},
	};
}

export default createUserSessionSlice;
