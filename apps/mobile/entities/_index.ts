import { ActivityPubServer } from './activitypub-server.entity';
import { ActivityPubUser } from './activitypub-user.entity';
import { ActivityPubStatus } from './activitypub-status.entity';
import { ActivityPubConversation } from './activitypub-conversation.entity';
import { ActivityPubChatRoom } from './activitypub-chatroom.entity';
import { ActivityPubCustomEmojiCategory } from './activitypub-emoji-category.entity';
import { ActivityPubCustomEmojiItem } from './activitypub-emoji.entity';
import { ActivityPubContentFilterRule } from './activitypub-content-moderation.entity';
import { Account, KeyValuePair } from './account.entity';
import { ActivityPubTag } from './activitypub-tag.entity';
import { UserDataTimeline } from './userdata-timeline.entity';
import { ActivityPubMediaAttachment } from './activitypub-media-attachment.entity';

export const schemas = [
	Account,
	KeyValuePair,
	ActivityPubChatRoom,
	ActivityPubContentFilterRule,
	ActivityPubConversation,
	ActivityPubCustomEmojiCategory,
	ActivityPubCustomEmojiItem,
	ActivityPubServer,
	ActivityPubStatus,
	ActivityPubUser,
	ActivityPubTag,
	UserDataTimeline,
	ActivityPubMediaAttachment,
];
