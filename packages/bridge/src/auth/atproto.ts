import {
	AtpSessionData,
	CredentialSession,
	AtpSessionEvent,
} from '@atproto/api';
import { jwtDecode } from 'jwt-decode';
import { BaseUrlNormalizationService } from '../utils/urls.js';

const DEFAULT_SERVICE_URL = 'https://bsky.social';

class AtProtoAuthService {
	/**
	 * NOTE: save the sessionData and pdsUrl to a database
	 * @param username
	 * @param password can be root password. app password recommended
	 * @param service
	 */
	static async loginWithPassword(
		username: string,
		password: string,
		service: string = DEFAULT_SERVICE_URL,
	): Promise<{
		sessionData: AtpSessionData;
		pdsUrl: string;
		serviceUrl: string;
		session: CredentialSession;
	} | null> {
		if (!username || !password) return null;

		let storedSession: AtpSessionData | null = null;
		const session = new CredentialSession(
			new URL(service),
			fetch,
			(evt, session1) => {
				storedSession = session1!;
			},
		);
		try {
			await session.login({
				identifier: username.includes('.')
					? username
					: `${username}.bsky.social`,
				password,
			});
			if (!session.session) return null;
			return {
				sessionData: session.session,
				pdsUrl: session.pdsUrl!.toString(),
				serviceUrl: session.serviceUrl!.toString(),
				session,
			};
		} catch (e) {
			return null;
		}
	}

	/**
	 * @param input the session object or access token
	 *
	 * @returns true for expired/missing token
	 */
	static isTokenExpired(input: string | { accessJwt: string }): boolean {
		const jwtString = typeof input === 'string' ? input : input.accessJwt;
		if (!jwtString) return true;
		const jwt = jwtDecode(jwtString);
		if (!jwt) return true;
		return jwt.exp! < Math.floor(new Date().getTime() / 1000);
	}

	/**
	 * - Resumes the session (if access token is valid)
	 * - Refresh the session (if refresh token is valid)
	 * - Returns an error (if both tokens are expired)
	 *
	 * @param obj
	 * @param serviceUrl
	 *
	 * @returns an updated session object and pds url
	 */
	static async resumeSession(
		obj: AtpSessionData,
		serviceUrl: string = DEFAULT_SERVICE_URL,
	): Promise<{ nextSession: AtpSessionData; pdsUrl: string } | null> {
		let nextEvt: AtpSessionEvent | null = null;
		let nextSession: AtpSessionData | null = null;

		function evtHandler(evt: AtpSessionEvent, session: AtpSessionData) {
			nextEvt = evt;
			nextSession = session;
		}

		const cs = AtProtoAuthService.createEmptyCredentialSession(
			serviceUrl,
			evtHandler,
		);

		cs.session = obj;
		await cs.refreshSession();

		if (!nextEvt) return null;
		switch (nextEvt) {
			case 'update': {
				return { nextSession: nextSession!, pdsUrl: cs.pdsUrl!.toString() };
			}
			case 'expired': {
				return null;
			}
			case 'network-error': {
				return null;
			}
			default: {
				return null;
			}
		}
	}

	/**
	 * Intended for use with the OAuth flow
	 * @param code
	 * @param verifier
	 * @param pds
	 */
	static async exchangeCodeForSession(
		code: string,
		verifier: string,
		pds?: string,
	) {
		const body = {
			grant_type: 'authorization_code',
			redirect_uri: 'https://suvam.io/dhaaga',
			code,
			code_verifier: verifier,
			client_id: 'https://suvam.io/dhaaga/client-metadata.json',
		};

		const response = await fetch(
			pds ? `https://${pds}/oauth/token` : 'https://bsky.social/oauth/token',
			{
				method: 'POST',
				body: JSON.stringify(body),
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);
		if (!response.ok) {
			console.log(response);
			return null;
		}
		const data = await response.json();
		console.log(data);
		return data;
	}

	static createEmptyCredentialSession(
		serviceUrl: string,
		cb?: (evt: AtpSessionEvent, session: any) => void,
	) {
		return new CredentialSession(
			new URL(BaseUrlNormalizationService.appendHttps(serviceUrl)),
			fetch,
			cb,
		);
	}
}

export default AtProtoAuthService;
