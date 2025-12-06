import type { mastodon } from 'masto';

/**
 * TS4053: Return type of public method
 * from exported class has or is using
 * name AccountCredentials from external module
 * but cannot be named.
 */
export type MastoStatus = mastodon.v1.Status;
export type MastoList = mastodon.v1.List;
export type MastoAccountCredentials = mastodon.v1.AccountCredentials;
export type MastoConversation = mastodon.v1.Conversation;
export type MastoContext = mastodon.v1.Context;
export type MastoRelationship = mastodon.v1.Relationship;
export type MastoTrendLink = mastodon.v1.TrendLink;
export type MastoTag = mastodon.v1.Tag;
export type MastoAccount = mastodon.v1.Account;
export type MastoFeaturedTag = mastodon.v1.FeaturedTag;
export type MastoFamiliarFollowers = mastodon.v1.FamiliarFollowers;
export type MastoNotification = mastodon.v1.Notification;
export type MastoGroupedNotificationsResults =
	mastodon.v1.GroupedNotificationsResults;
export type MastoScheduledStatus = mastodon.v1.ScheduledStatus;
export type MastoMediaAttachment = mastodon.v1.MediaAttachment;
export type MastoMediaAttachmentMeta = mastodon.v1.MediaAttachmentMeta;
export type MastoTranslation = mastodon.v1.Translation;
