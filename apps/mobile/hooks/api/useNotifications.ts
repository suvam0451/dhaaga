import { useQuery } from '@tanstack/react-query';
import { useAppApiClient } from '#/states/global/hooks';
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
	const { client } = useAppApiClient();
	return useQuery(getMentionNotificationsQueryOpts(client, maxId));
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
	const { client } = useAppApiClient();

	return useQuery(getSocialNotificationsQueryOpts(client, maxId));
}

/**
 * Get all subscriptions for
 * the active account
 * @param maxId
 */
function useApiGetSubscriptionUpdates(maxId?: string | null) {
	const { client } = useAppApiClient();
	return useQuery(getSubscriptionNotificationsQueryOpts(client, maxId));
}

export {
	useApiGetMentionUpdates,
	useApiGetSocialUpdates,
	useApiGetChatUpdates,
	useApiGetSubscriptionUpdates,
};
