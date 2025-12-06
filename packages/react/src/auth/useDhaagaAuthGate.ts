import { useState, useRef } from 'react';
import { generateDhaagaAuthStrategy } from '@dhaaga/bridge/auth';

type ReturnType =
	| {
			strategy: 'activitypub';
			params: {
				signInUrl: string;
				instance: string;
				software: string;
				clientId: string;
				clientSecret: string;
			};
	  }
	| {
			strategy: 'miauth';
			params: {
				signInUrl: string;
				instance: string;
				software: string;
			};
	  }
	| {
			strategy: 'error';
			params: {
				code: string;
				message: string;
			};
	  };

/**
 * Use this hook alongside any form manager
 * of your choice to handle the sign-in process
 * until token generation
 *
 * covers:
 * - instance software detection
 * - sign-in url generation
 *
 * for best results, use a different sign-in workflow
 * for Miauth and ActivityPub (although they are very similar for now)
 * @param strategy
 * @param placeholder
 */
function useDhaagaAuthGate(
	strategy: 'activitypub' | 'miauth' = 'activitypub',
	placeholder: string = 'mastodon.social',
) {
	const [Instance, setInstance] = useState(placeholder);
	const [IsLoading, setIsLoading] = useState(false);
	const [ErrorMessage, setErrorMessage] = useState<string | null>(null);

	/**
	 *	it is recommended to cache the activitypub client token
	 *	once they are generated for a given domain.
	 *
	 * 	if not done, the server may rate limit your login attempts
	 * 	on the following visits
	 */
	const cachedClientTokens = useRef<{
		clientId: string;
		clientSecret: string;
	} | null>(null);

	/**
	 * With an instance URL provided,
	 * A) identify the software used by the instance
	 * B) (re)generate the client tokens (Mastodon only)
	 * C) redirect to the sign-in page
	 *
	 * NOTE: for ActivityPub strategy, cache the generated
	 * client tokens against the instance URL for
	 * future visits (/w expiry)
	 */
	async function processAuth(): Promise<ReturnType> {
		setIsLoading(true);
		try {
			// const tokens = appManager.storage.getAtprotoServerClientTokens(Instance);
			const signInStrategy = await generateDhaagaAuthStrategy(
				Instance,
				{
					appName: 'Dhaaga',
					appWebsite: 'https://suvam.io/dhaaga',
					appCallback: 'https://suvam.io/dhaaga',
				},
				cachedClientTokens.current!,
			);

			/**
			 * In-App redirection to the sign-in page
			 */
			switch (strategy) {
				case 'activitypub': {
					return {
						strategy: 'activitypub',
						params: {
							signInUrl: signInStrategy?.loginUrl,
							instance: Instance,
							software: signInStrategy?.software,
							clientId: signInStrategy?.clientId!,
							clientSecret: signInStrategy?.clientSecret!,
						},
					};
				}
				case 'miauth': {
					return {
						strategy: 'miauth',
						params: {
							signInUrl: signInStrategy?.loginUrl,
							instance: Instance,
							software: signInStrategy?.software,
						},
					};
				}
				default: {
					throw new Error('invalid strategy');
				}
			}
		} catch (e) {
			return {
				strategy: 'error',
				params: {
					code: 'E_Failed_To_Generate_Strategy',
					message: 'Something went wrong',
				},
			};
		} finally {
			setIsLoading(false);
		}
	}

	return {
		resolve: processAuth,
		Instance,
		setInstance,
		isLoading: IsLoading,
		cachedClientTokens,
	};
}
export default useDhaagaAuthGate;
