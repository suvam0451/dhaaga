import { Realm } from 'realm';
import { Account } from '../../entities/account.entity';
import { jwtDecode } from 'jwt-decode';
import { Agent, AtpSessionData, CredentialSession } from '@atproto/api';
import AccountService from '../account.service';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';
import AccountRepository from '../../repositories/account.repo';

/**
 * Helps manage session
 * for an atproto based account
 */
class AtprotoSessionService {
	private readonly db: Realm;
	private readonly acct: Account;
	private readonly sessionManager: CredentialSession;
	private nextSession: AtpSessionData;
	private oldSession: AtpSessionData;
	private nextStatusCode: string;

	constructor(db: Realm, acct: Account) {
		this.db = db;
		this.acct = acct;
		this.sessionManager = new CredentialSession(
			new URL(AtprotoSessionService.cleanLink(this.acct.subdomain)),
			fetch,
			(evt, session) => {
				this.nextStatusCode = evt;
				if (session) this.nextSession = session;
			},
		);
		this.oldSession = JSON.parse(
			AccountRepository.findSecret(this.db, this.acct, 'session')?.value,
		);
	}

	static create(db: Realm, acct: Account) {
		return new AtprotoSessionService(db, acct);
	}

	private static cleanLink(urlLike: string) {
		if (urlLike.startsWith('http://') || urlLike.startsWith('https://')) {
		} else {
			urlLike = 'https://' + urlLike;
		}
		return urlLike.replace(/\/+$/, '');
	}

	/**
	 * Resumes the client session
	 *
	 * Call this before making any requests
	 */
	async resume() {
		this.sessionManager.session = this.oldSession;

		/**
		 * Let's see how well this holds
		 *
		 * Ideally, we should refresh our tokens a bit ahead of time
		 * to work around network errors (in which case, old token
		 * would be attempted to be used)
		 */
		const _jwt: any = jwtDecode(this.sessionManager.session.accessJwt);
		const IS_EXPIRED = _jwt.exp < Math.floor(new Date().getTime() / 1000);

		try {
			if (IS_EXPIRED) {
				await this.sessionManager.refreshSession();
			} else {
				await this.sessionManager.resumeSession(this.sessionManager.session);
			}
		} catch (e) {
			console.log(e);
			return this;
		}
		return this;
	}

	/**
	 * Checks the updates tokens
	 * and stores them in the db
	 */
	saveSession() {
		const statusCode = this.nextStatusCode;
		switch (statusCode) {
			case 'update': {
				this.db.write(() => {
					AccountRepository.setSecret(
						this.db,
						this.acct,
						'session',
						JSON.stringify(this.nextSession),
					);
				});
				// console.log('BEFORE', this.oldSession.accessJwt);
				// console.log('AFTER', this.nextSession.accessJwt);
				// cycle forward
				this.oldSession = this.nextSession;
				return { success: true, data: this.nextSession };
			}
			case 'expired': {
				return {
					success: false,
					data: this.oldSession,
					reason: 'E_Token_Expired',
				};
			}
			case 'network-error': {
				return {
					success: false,
					data: this.oldSession,
					reason: 'E_Network_Error',
				};
			}
			default: {
				console.log('[WARN]: atproto session event not handled', statusCode);
				return { success: false, data: this.oldSession };
			}
		}
	}

	/**
	 * Attempt to log in using
	 * submitted credentials
	 * @param db
	 * @param username
	 * @param appPassword
	 * @param service
	 */
	static async login(
		db: Realm,
		username: string,
		appPassword: string,
		service: string = 'https://bsky.social',
	) {
		if (!username || !appPassword)
			return { success: false, reason: 'E_Empty_Username_Or_Password' };
		let storedSession = null;
		const session = new CredentialSession(
			new URL(service),
			fetch,
			(evt, session1) => {
				console.log(evt);
				storedSession = session1;
			},
		);

		try {
			const loginResp = await session.login({
				identifier: username.includes('.')
					? username
					: `${username}.bsky.social`,
				password: appPassword,
			});

			const agent = new Agent(session);

			const res = await agent.getProfile({ actor: agent.did });

			const accessToken = loginResp.data.accessJwt;
			const refreshToken = loginResp.data.refreshJwt;
			const instance = 'bsky.social';
			const avatarUrl = res.data.avatar;
			const displayName = res.data.displayName;
			const _username = res.data.handle;
			const did = res.data.did;

			AccountService.upsert(db, {
				subdomain: instance,
				domain: KNOWN_SOFTWARE.BLUESKY,
				username: _username,
				avatarUrl,
				displayName,
				credentials: [
					{
						key: 'display_name',
						value: displayName,
					},
					{
						key: 'avatar',
						value: avatarUrl,
					},
					{
						key: 'access_token',
						value: accessToken,
					},
					{
						key: 'refresh_token',
						value: refreshToken,
					},
					{
						key: 'did',
						value: did,
					},
					{
						key: 'app_password',
						value: appPassword,
					},
					{
						key: 'session',
						value: JSON.stringify(storedSession),
					},
				],
			});

			return { success: true };
		} catch (e) {
			console.log(e);
			return { success: false };
		}
	}
}

export default AtprotoSessionService;
