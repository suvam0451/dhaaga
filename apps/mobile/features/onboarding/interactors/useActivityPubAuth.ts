import { useState } from 'react';
import { useAppManager } from '../../../hooks/utility/global-state-extractors';
import { ActivityPubService, KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { router } from 'expo-router';
import { APP_ROUTING_ENUM } from '../../../utils/route-list';

/**
 * Use this to authenticate users for Misskey (MiAuth)
 * and Mastodon (ActivityPub) users
 * @param strategy
 * @param placeholder
 */
function useActivityPubAuth(
	strategy: 'activitypub' | 'miauth' = 'activitypub',
	placeholder: string = 'mastodon.social',
) {
	const [Instance, setInstance] = useState(placeholder);
	const [Software, setSoftware] = useState<KNOWN_SOFTWARE | null>(null);
	const [IsLoading, setIsLoading] = useState(false);
	const { appManager } = useAppManager();

	/**
	 * With an instance URL provided,
	 * A) identify the software used by the instance
	 * B) (re)generate the client tokens (Mastodon only)
	 * C) redirect to the sign-in page
	 */
	async function resolve() {
		setIsLoading(true);
		try {
			const tokens = appManager.storage.getAtprotoServerClientTokens(Instance);
			const { data: signInStrategy, error } =
				await ActivityPubService.signInUrl(Instance, tokens);
			if (error) {
				// TODO: handle instance software detection error
				console.log(error);
				return setIsLoading(false);
			}

			// Save tokens for repeat visits (N/A for MiAuth)
			if (strategy === 'activitypub') {
				if (signInStrategy?.clientId && signInStrategy?.clientSecret) {
					appManager.storage.setAtprotoServerClientTokens(
						Instance,
						signInStrategy?.clientId,
						signInStrategy?.clientSecret,
					);
				}
			}

			/**
			 * In-App redirection to the sign-in page
			 */
			switch (strategy) {
				case 'activitypub': {
					router.push({
						pathname: APP_ROUTING_ENUM.MASTODON_SIGNIN,
						params: {
							signInUrl: signInStrategy?.loginUrl,
							subdomain: Instance,
							domain: signInStrategy?.software,
							clientId: signInStrategy?.clientId,
							clientSecret: signInStrategy?.clientSecret,
						},
					});
					break;
				}
				case 'miauth': {
					router.push({
						pathname: APP_ROUTING_ENUM.MISSKEY_SIGNIN,
						params: {
							signInUrl: signInStrategy?.loginUrl,
							subdomain: Instance,
							domain: signInStrategy?.software,
						},
					});
					break;
				}
			}
		} finally {
			setIsLoading(false);
		}
	}

	return { resolve, Instance, setInstance, isLoading: IsLoading };
}
export default useActivityPubAuth;
