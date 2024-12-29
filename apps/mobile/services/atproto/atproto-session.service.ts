import { Agent, AtpSessionData, CredentialSession } from '@atproto/api';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { AccountService } from '../../database/entities/account';
import AccountMetaService from '../../database/services/account-secret.service';
import { Account } from '../../database/_schema';
import {
	ACCOUNT_METADATA_KEY,
	AccountMetadataService,
} from '../../database/entities/account-metadata';
import { jwtDecode } from '../../utils/jwt-decode.utils';
import { DataSource } from '../../database/dataSource';

/**
 * Helps manage session
 * for an atproto based account
 */
class AtprotoSessionService {
	private readonly db: DataSource;
	private readonly acct: Account;
	private readonly sessionManager: CredentialSession;
	private nextSession: AtpSessionData;
	private oldSession: AtpSessionData;
	private nextStatusCode: string;

	constructor(db: DataSource, acct: Account) {
		this.db = db;
		this.acct = acct;
		this.sessionManager = new CredentialSession(
			new URL(AtprotoSessionService.cleanLink(this.acct.server)),
			fetch,
			(evt, session) => {
				this.nextStatusCode = evt;
				if (session) this.nextSession = session;
			},
		);

		const secret = AccountMetadataService.getKeyValueForAccountSync(
			db,
			this.acct,
			ACCOUNT_METADATA_KEY.ATPROTO_SESSION_OBJECT,
		);
		this.oldSession = JSON.parse(secret);
	}

	static create(db: DataSource, acct: Account) {
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
		const jwtDecodeResult = jwtDecode(this.sessionManager.session.accessJwt);
		if (jwtDecodeResult.type !== 'success') {
			console.log('[WARN]: failed to parse jwt token');
			return this;
		}
		const _jwt: any = jwtDecodeResult.value;

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
	async saveSession() {
		const statusCode = this.nextStatusCode;
		switch (statusCode) {
			case 'update': {
				await AccountMetaService.upsertMeta(
					this.acct,
					'session',
					JSON.stringify(this.nextSession),
				);
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
		db: DataSource,
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

			AccountService.upsert(
				db,
				{
					server: instance,
					driver: KNOWN_SOFTWARE.BLUESKY,
					username: _username,
					avatarUrl,
					displayName,
				},
				[
					{
						key: 'display_name',
						value: displayName,
						type: 'string',
					},
					{
						key: 'avatar',
						value: avatarUrl,
						type: 'string',
					},
					{
						key: 'access_token',
						value: accessToken,
						type: 'string',
					},
					{
						key: 'refresh_token',
						value: refreshToken,
						type: 'string',
					},
					{
						key: 'did',
						value: did,
						type: 'string',
					},
					{
						key: 'app_password',
						value: appPassword,
						type: 'string',
					},
					{
						key: 'session',
						value: JSON.stringify(storedSession),
						type: 'json',
					},
				],
			);

			return { success: true };
		} catch (e) {
			console.log(e);
			return { success: false };
		}
	}
}

export default AtprotoSessionService;
