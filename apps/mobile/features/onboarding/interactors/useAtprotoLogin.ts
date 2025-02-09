import { useEffect, useState } from 'react';
import { SuvamIoService } from '../../../services/suvamio.service';
import * as WebBrowser from 'expo-web-browser';
import { useLocalSearchParams } from 'expo-router';
import AtprotoSessionService from '../../../services/atproto/atproto-session.service';

function useAtprotoLogin() {
	const [IsLoading, setIsLoading] = useState(false);
	const [Verifier, setVerifier] = useState(null);

	const params = useLocalSearchParams();
	const _state: string = params['state'] as string;
	const _code: string = params['code'] as string;

	async function onObtainCode() {
		setIsLoading(true);
		try {
			console.log(_state, _code, Verifier);
			const { success, data, error } =
				await AtprotoSessionService.exchangeCodeForSession(_code, Verifier);

			console.log(success);
		} catch (e) {
			console.log(e);
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		if (_state && _code) {
			// redirection successful!
			onObtainCode();
		}
	}, [_state, _code]);

	async function startLoginFlow(handle: string) {
		setIsLoading(true);
		const { data } = await SuvamIoService.generateAtprotoRedirectUrl(handle);
		console.log('obtained data', data);
		setVerifier(data.verifier);

		/**
		 * will perform the oauth, redirecting the
		 * user here after completion
		 */
		await WebBrowser.openAuthSessionAsync(data.href, undefined, {});
		setIsLoading(false);
	}

	return { startLoginFlow, isLoading: IsLoading };
}

export default useAtprotoLogin;
