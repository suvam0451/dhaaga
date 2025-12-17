import ProfileSessionManager from '#/states/sessions/profile-session.service';
import AccountSessionManager from '#/states/sessions/account-session.service';
import { Account, AccountService, Profile } from '@dhaaga/db';
import {
	ApiTargetInterface,
	KNOWN_SOFTWARE,
	type UserObjectType,
} from '@dhaaga/bridge';
import {
	AppStateImmerGetObject,
	AppStateImmerSetObject,
} from '#/states/global/typings';
import { PostPublisherService } from '#/states/event-bus/post.publisher';
import { FeedPublisherService } from '#/states/event-bus/feed.publisher';

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
	feedEventBus: FeedPublisherService;
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
	feedEventBus: null,
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
						state: totalAccounts === 0 ? 'no-account' : 'invalid',
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

			const acctManager = new AccountSessionManager(_db, acct);

			try {
				const { acct, client, me } = await acctManager.restoreAppSession(_db);

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
						client: client,
						driver: client.driver,
						server: client.server,
						acctManager,
						profileManager: new ProfileSessionManager(_db),
						postEventBus: new PostPublisherService(client),
						userEventBug: new PostPublisherService(client),
						tagEventBus: new PostPublisherService(client),
						feedEventBus: new FeedPublisherService(client),
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
