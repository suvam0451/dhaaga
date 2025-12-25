import { useEffect, useState, useRef } from 'react';
import { RandomUtil, verifyMisskeyToken } from '@dhaaga/bridge';

function useMiauthLogin(instance: string, signInUrl: string) {
	const [Code, setCode] = useState<string | null>(null);
	const [IsLoading, setIsLoading] = useState(false);
	const [Error, setError] = useState<string | null>(null);
	const [UserData, setUserData] = useState<{
		id: string;
		displayName: string;
		username: string;
		avatar: string;
	} | null>();
	const [AuthCompleted, setAuthCompleted] = useState(false);

	async function autoVerifyFromSession(session: string) {
		if (AuthCompleted) return;
		const res = await verifyMisskeyToken(`https://${instance}`, session!);
		if (res.ok) {
			setCode(res.token);
			setUserData({
				id: res?.user?.id!,
				displayName: res?.user?.name!,
				username: res?.user?.username!,
				avatar: res?.user?.avatarUrl!,
			});
			setAuthCompleted(true);
		}
	}

	const lastState = useRef<string | null>(null);

	function resetAuth() {
		setIsLoading(false);
		setCode(null);
		setError(null);
		setUserData(null);
		setAuthCompleted(false);
	}

	// Misskey has no use for the callback token
	function RNWebviewStateChangeCallback(state: any) {
		console.log(state);

		// repeated api calls against the same code will fail
		if (state.url === lastState.current) return;

		const regex = /^https:\/\/suvam\.io\/dhaaga\?session=([^&]+)/;
		const match = state.url.match(regex);
		if (match) {
			const session = match[1];
			lastState.current = state.url;
			autoVerifyFromSession(session);
		}
	}

	/**
	 * If the signInUrl itself contains the session
	 * token, use that instead
	 */
	useEffect(() => {
		try {
			const regex = /^https:\/\/(.*?)\/miauth\/(.*?)\?.*?/;
			if (regex.test(signInUrl)) {
				const session = regex.exec(signInUrl)![2];
				setCode(session);
			}
		} catch (e) {
			setCode(RandomUtil.nanoId());
		}
	}, []);

	async function authenticate() {
		return UserData;
	}

	return {
		RNWebviewStateChangeCallback,
		authenticate,
		completed: AuthCompleted,
		loading: IsLoading,
		error: Error,
		userData: UserData,
		code: Code,
		setCode,
		reset: resetAuth,
	};
}

export default useMiauthLogin;
