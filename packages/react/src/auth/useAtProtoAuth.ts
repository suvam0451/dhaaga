import { useState } from 'react';
import { AtProtoAuthService } from '@dhaaga/bridge/auth';
import {
	Agent,
	type AppBskyActorGetProfile,
	AtpSessionData,
} from '@atproto/api';

function useAtProtoAuth(serviceUrl = 'https://bsky.social') {
	const [Username, setUsername] = useState<string | null>(null);
	const [Password, setPassword] = useState<string | null>(null);
	const [ServiceUrl, setServiceUrl] = useState(serviceUrl);
	const [IsLoading, setIsLoading] = useState(false);
	const [UserData, setUserData] =
		useState<AppBskyActorGetProfile.Response | null>(null);
	const [SessionData, setSessionData] = useState<AtpSessionData | null>(null);
	const [AuthCompleted, setAuthCompleted] = useState(false);

	function reset() {
		setAuthCompleted(false);
		setUserData(null);
		setSessionData(null);
	}

	async function authenticate(): Promise<{
		profileData: AppBskyActorGetProfile.Response;
		sessionData: AtpSessionData;
	} | null> {
		setIsLoading(true);
		if (!Username || !Password) return null;

		try {
			const result = await AtProtoAuthService.loginWithPassword(
				Username,
				Password,
				ServiceUrl,
			);
			if (!result) return null;
			const { sessionData, session } = result;
			setSessionData(sessionData);

			const agent = new Agent(session);
			const profileData = await agent.getProfile({ actor: sessionData.did });
			setUserData(profileData);

			setAuthCompleted(true);
			return { profileData, sessionData };
		} catch (e) {
			return null;
		}
	}

	return {
		// form data
		username: Username,
		setUsername,
		password: Password,
		setPassword,
		serviceUrl: ServiceUrl,
		setServiceUrl,
		// auth data
		completed: AuthCompleted,
		loading: IsLoading,
		userData: UserData,
		sessionData: SessionData,
		authenticate,
		reset,
	};
}

export default useAtProtoAuth;
