/**
 * Typings for various DTOs are exposed outside
 * the library as pure type definitions
 */

export type { MessageObjectType } from './chat.js';
export type { FeedObjectType } from './feed.js';
export type {
	NotificationObjectType,
	NotificationUserGroupType,
} from './notifications.js';
export type {
	PostRootObjectType,
	PostStatsType,
	PostObjectType,
	PostAuthorType,
	PostMediaAttachmentType,
	ActivityPubReactionStateType,
	PostMentionObjectType,
} from './post.js';
export type { CustomEmojiObjectType } from './reactions.js';
export type { UserObjectType } from './user.js';
export type { PostLinkAttachmentObjectType } from './link-attachments.js';
