import { useState, useRef } from 'react';
import { ActivityPubService, KNOWN_SOFTWARE } from '@dhaaga/bridge';

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
	const [Software, setSoftware] = useState<KNOWN_SOFTWARE | null>(null);
	const [IsLoading, setIsLoading] = useState(false);
	const [Error, setError] = useState<string | null>(null);

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
	 * use this function to help to detect and show the
	 * software used by the instance
	 *
	 * in case of failure, the given instance may be
	 * unsupported/invalid
	 */
	async function detectSoftware() {}

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
		// if (strategy === 'activitypub' && !cachedClientTokens.current)
		// 	return {
		// 		strategy: 'error',
		// 		params: {
		// 			code: 'E_Missing_Cached_Token',
		// 			message: 'Missing cached token',
		// 		},
		// 	};

		setIsLoading(true);
		try {
			// const tokens = appManager.storage.getAtprotoServerClientTokens(Instance);
			const { data: signInStrategy, error } =
				await ActivityPubService.signInUrl(
					Instance,
					cachedClientTokens.current!,
				);
			if (error) {
				// TODO: handle instance software detection error
				console.log(error);
				setIsLoading(false);
				return {
					strategy: 'error',
					params: {
						code: 'E_Failed_To_Detect_Software',
						message: 'Failed to detect software',
					},
				};
			}

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
					return {
						strategy: 'error',
						params: {
							code: 'E_Failed_To_Generate_Strategy',
							message: 'Something went wrong',
						},
					};
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
