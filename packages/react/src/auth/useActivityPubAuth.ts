import { useState } from 'react';
import { BaseApiAdapter } from '@dhaaga/bridge';
import type { MastoAccountCredentials } from '@dhaaga/bridge';

/**
 * The auth processor hooks are separated
 * from the sign-in url generator hooks
 * because your app is expected to switch
 * screens and change state due to the external
 * browser callback
 */
function useActivityPubAuth(
	instance: string,
	_clientId: string,
	_clientSecret: string,
) {
	const [Code, setCode] = useState<string | null>(null);
	const [IsLoading, setIsLoading] = useState(false);
	const [Error, setError] = useState<string | null>(null);
	const [UserData, setUserData] = useState<MastoAccountCredentials | null>();

	/**
	 * Resets the local auth state.
	 *
	 * Does not change the input params, therefore safe
	 */
	function reset() {
		setIsLoading(false);
		setCode(null);
		setError(null);
		setUserData(null);
	}

	/**
	 * Detects changes in the webview url and extracts
	 * the code
	 *
	 * NOTE: This function will only work with react-native-webview
	 * when provided the signInUrl as source uri
	 *
	 * NOTE: For Akkoma, the user will have to copy-paste
	 * the token manually in your UI
	 */
	function RNWebviewStateChangeCallback(state: any) {
		const regex = /^https:\/\/(.*?)\/oauth\/authorize\/native\?code=(.*?)$/;
		if (regex.test(state.url)) {
			const code = state.url.match(regex)[2];
			setCode(code);
		} else {
			setCode(null);
		}
	}

	/**
	 * NOTE: the returned account credential object
	 * is in snake case
	 */
	async function authenticate(): Promise<MastoAccountCredentials | null> {
		if (!_clientId || !_clientSecret) {
			setError('E_Missing_Client_Credentials');
			return null;
		}
		setIsLoading(true);
		try {
			const token = await new BaseApiAdapter().instances.getMastodonAccessToken(
				instance,
				Code!,
				_clientId,
				_clientSecret,
			);

			setCode(token || Code);

			const { data: verified, error } =
				await new BaseApiAdapter().instances.verifyCredentials(
					instance /**
					 * Pleroma/Akkoma give
					 * us another token, while one
					 * exists already (above request will fail)
					 *
					 * ^ In such cases, the pasted code is
					 * itself the token
					 */,
					token || Code, // fucking yolo it, xDD
				);

			if (error) {
				setError(error.code);
				return null;
			} else {
				setUserData(verified);
				return verified;
			}
		} catch (e) {
			return null;
		} finally {
			setIsLoading(false);
		}
	}

	return {
		RNWebviewStateChangeCallback,
		userData: UserData,
		code: Code,
		setCode,
		loading: IsLoading,
		authenticate,
		error: Error,
		reset,
	};
}

export default useActivityPubAuth;
