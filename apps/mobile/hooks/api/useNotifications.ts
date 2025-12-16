import { useQuery } from '@tanstack/react-query';
import { useActiveUserSession, useAppApiClient } from '#/states/global/hooks';
import {
	getChatNotificationsQueryOpts,
	getMentionNotificationsQueryOpts,
	getSocialNotificationsQueryOpts,
	getSubscriptionNotificationsQueryOpts,
} from '@dhaaga/react';

/**
 * Get Mentions
 *
 * - Grouped for Mastodon
 */
function useApiGetMentionUpdates(maxId?: string | null) {
	const { driver, client, server } = useAppApiClient();
	const { acct } = useActiveUserSession();

	return useQuery(
		getMentionNotificationsQueryOpts(
			client,
			driver,
			server,
			acct.identifier,
			maxId,
		),
	);
}

/**
 * Fetches direct message data
 */
function useApiGetChatUpdates() {
	const { client } = useAppApiClient();

	return useQuery(getChatNotificationsQueryOpts(client));
}

/**
 * Get all social updates
 * (likes/shares/reactions/follows)
 * for the active account
 * @param maxId
 */
function useApiGetSocialUpdates(maxId?: string | null) {
	const { driver, client, server } = useAppApiClient();
	const { acct } = useActiveUserSession();

	return useQuery(
		getSocialNotificationsQueryOpts(
			client,
			driver,
			server,
			acct.identifier,
			maxId,
		),
	);
}

/**
 * Get all subscriptions for
 * the active account
 * @param maxId
 */
function useApiGetSubscriptionUpdates(maxId?: string | null) {
	const { acct } = useActiveUserSession();
	const { driver, client, server } = useAppApiClient();

	return useQuery(
		getSubscriptionNotificationsQueryOpts(
			client,
			driver,
			server,
			acct.identifier,
			maxId,
		),
	);
}

export {
	useApiGetMentionUpdates,
	useApiGetSocialUpdates,
	useApiGetChatUpdates,
	useApiGetSubscriptionUpdates,
};
