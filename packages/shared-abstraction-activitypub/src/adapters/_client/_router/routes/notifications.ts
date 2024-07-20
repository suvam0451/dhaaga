import { LibraryResponse } from '../_types.js';
import { MastoNotification, MegaNotification } from '../../_interface.js';

export enum DhaagaJsNotificationType {
	/**
	 * Someone mentioned you in their status
	 */
	MENTION = 'mention', // shared with misskey
	/**
	 * Someone you enabled notifications for has posted a status
	 */
	STATUS = 'status',
	/**
	 * Someone boosted one of your statuses
	 */
	REBLOG = 'reblog',
	/**
	 * Someone followed you
	 */
	FOLLOW = 'follow', // shared with misskey
	/**
	 * Someone requested to follow you
	 */
	FOLLOW_REQUEST = 'follow_request',
	/**
	 * Someone favourited one of your statuses
	 */
	FAVOURITE = 'favourite',
	/**
	 * A poll you have voted in or created has ended
	 */
	POLL_NOTIFICATION = 'poll',
	/**
	 * A status you interacted with has been edited
	 */
	STATUS_EDITED = 'update',
	/**
	 * Someone signed up (optionally sent to admins)
	 */
	ADMIN_SIGNUP = 'admin.sign_up',
	ADMIN_REPORT = 'admin.report',

	NOTE = 'note',
	// follow
	// mention
	REPLY = 'reply',
	RENOTE = 'renote',
	QUOTE = 'quote',
	REACTION = 'reaction',
	POLL_ENDED = 'pollEnded',
	FOLLOW_REQUEST_RECEIVED = 'receiveFollowRequest',
	FOLLOW_REQUEST_ACCEPTED = 'followRequestAccepted',
	ROLES_ASSIGNED = 'roleAssigned',
	ACHIEVEMENT_EARNED = 'achievementEarned',
	APP = 'app',
	TEST = 'test',
	REACTION_GROUPED = 'reaction:grouped',
	RENOTE_GROUPED = 'renote:grouped',
	POLL_VOTE = 'pollVote',
	GROUP_INVITED = 'groupInvited',
}

export type NotificationGetQueryDto = {
	limit: number;
	minId?: string;
	maxId?: string;
	sinceId?: string;
	accountId?: string; // restrict to notifications recieved from this account
	types: DhaagaJsNotificationType[];
	excludeTypes: DhaagaJsNotificationType[];
	markAsRead?: boolean; // misskey
};

export type Pleroma_Notification_Type = '';

export interface NotificationsRoute {
	get(query: NotificationGetQueryDto): Promise<
		LibraryResponse<{
			data: MastoNotification[] | MegaNotification[];
			minId?: string | null;
			maxId?: string | null;
		}>
	>;
}
