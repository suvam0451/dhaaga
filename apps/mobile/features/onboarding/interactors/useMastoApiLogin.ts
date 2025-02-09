import { useState } from 'react';
import { useAppManager } from '../../../hooks/utility/global-state-extractors';
import ActivityPubService from '../../../services/activitypub.service';
import { router } from 'expo-router';
import { APP_ROUTING_ENUM } from '../../../utils/route-list';

function useMastoApiLogin() {
	const [Server, setServer] = useState('mastodon.social');
	const [IsLoading, setIsLoading] = useState(false);
	const { appManager } = useAppManager();

	/**
	 * On selection of a server, try to
	 * detect the software used in it
	 * and redirect the user accordingly
	 */
	async function resolve() {
		setIsLoading(true);
		try {
			const signInStrategy = await ActivityPubService.signInUrl(
				Server,
				appManager,
			);
			if (signInStrategy?.clientId && signInStrategy?.clientSecret) {
				appManager.storage.setAtprotoServerClientTokens(
					Server,
					signInStrategy?.clientId,
					signInStrategy?.clientSecret,
				);
			}
			router.push({
				pathname: APP_ROUTING_ENUM.MASTODON_SIGNIN,
				params: {
					signInUrl: signInStrategy?.loginUrl,
					subdomain: Server,
					domain: signInStrategy?.software,
					clientId: signInStrategy?.clientId,
					clientSecret: signInStrategy?.clientSecret,
				},
			});
		} finally {
			setIsLoading(false);
		}
	}

	return { resolve, server: Server, setServer, isLoading: IsLoading };
}
export default useMastoApiLogin;
