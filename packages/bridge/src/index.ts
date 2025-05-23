export {
	type ApiTargetInterface,
	AtprotoApiAdapter,
	BaseApiAdapter,
	MastoApiAdapter,
	MisskeyApiAdapter,
	PleromaApiAdapter,
} from './adapters/index.js';

import ActivityPubService from './services/activitypub.service.js';
export { ActivityPubService };
import ActivityPubReactionsService, {
	type ActivityPubReactionStateType,
	type ActivityPubReactionItemType,
} from './services/activitypub-reactions.service.js';
export { ActivityPubReactionsService };
export type { ActivityPubReactionStateType, ActivityPubReactionItemType };

//  status adapters
import PostAdapterBase from './implementors/status/default.js';
import MastoApiPostAdapter from './implementors/status/mastodon.js';
import MisskeyApiPostAdapter from './implementors/status/misskey.js';
import ActivitypubHelper from './services/activitypub.js';
import { InstanceApi_CustomEmojiDTO } from './adapters/_client/_router/routes/instance.js';
import axios from 'axios';
import { UserDetailed } from 'misskey-js/autogen/models.js';
import { errorBuilder } from './adapters/_client/_router/dto/api-responses.dto.js';
import { LibraryPromise } from './adapters/_client/_router/routes/_types.js';
import {
	AccountMutePostDto,
	AccountRouteStatusQueryDto,
	BookmarkGetQueryDTO,
	FollowerGetQueryDTO,
} from './adapters/_client/_router/routes/accounts.js';
// used to read viewer
import AtprotoPostAdapter from './implementors/status/bluesky.js';
import { KNOWN_SOFTWARE } from './data/driver.js';
import { DriverService } from './services/driver.js';

export {
	DriverService,
	PostAdapterBase,
	MastoApiPostAdapter,
	MisskeyApiPostAdapter,
	AtprotoPostAdapter,
};

// export media attachment adapters and interfaces
export {
	DriveFileToMediaAttachmentAdapter,
	MediaAttachmentToMediaAttachmentAdapter,
	UnknownToMediaAttachmentAdapter,
} from './implementors/media-attachment/adapter.js';
export {
	DriveFileInstance,
	MediaAttachmentInstance,
} from './implementors/media-attachment/unique.js';
export type { MediaAttachmentTargetInterface } from './implementors/index.js';

// export user profile adapters and interfaces
export { DefaultUser } from './implementors/profile/default.js';

// stub types
export type {
	ActivityPubStatus,
	ActivityPubStatuses,
	ActivityPubAccount,
} from './types/activitypub.js';

// export types, adapters and interfaces
export {
	ActivityPubUserAdapter,
	type UserTargetInterface,
	type UserType,
} from './implementors/profile/_interface.js';
export type { PostTargetInterface } from './implementors/status/_interface.js';
export {
	ActivityPubTagAdapter,
	type TagTargetInterface,
	type TagType,
} from './implementors/tag/_interface.js';

export type { DhaagaJsTimelineQueryOptions } from './adapters/_client/_router/routes/_index.js';

export type { MfmNode } from './services/index.js';
export { AtprotoPostService, AtprotoFeedService } from './services/index.js';

export { UserDetailedInstance } from './implementors/profile/_interface.js';
export { AccountInstance } from './implementors/profile/_interface.js';
export { ActivitypubStatusAdapter } from './implementors/status/_adapters.js';

export { ActivitypubHelper };
export { parseStatusContent, preprocessPostContent } from './services/index.js';

type MiauthSessionCheckResponse =
	| { ok: false }
	| {
			ok: true;
			token: string;
			user: UserDetailed;
	  };

export const verifyMisskeyToken = async (host: string, session: string) => {
	const res = await axios.post<MiauthSessionCheckResponse>(
		`${host}/api/miauth/${session}/check`,
	);
	return res.data;
};

export { type LibraryPromise, errorBuilder };

// DTOs
export type {
	AccountMutePostDto,
	AccountRouteStatusQueryDto,
	BookmarkGetQueryDTO,
	FollowerGetQueryDTO,
};

export { KNOWN_SOFTWARE };
export type { InstanceApi_CustomEmojiDTO };
export { DriverNotificationType } from './data/driver.js';
export type { LibraryResponse } from './types/result.types.js';
export { ApiErrorCode } from './types/result.types.js';

export {
	RandomUtil,
	ResultOk,
	ResultErr,
	type Result,
	type AsyncResult,
} from './utils/index.js';

// chat services
export { ChatParser } from './parsers/chat.js';
export type { MessageObjectType } from './parsers/chat.js';
// feed services
export { FeedParser } from './parsers/feed.js';
export type { FeedObjectType } from './parsers/feed.js';
// text services
export { TextParser } from './parsers/text.js';
// post services
export {
	PostParser,
	PostInspector,
	PostResolver,
	postObjectSchema,
} from './parsers/post.js';
export type {
	PostObjectType,
	PostRootObjectType,
	PostAuthorType,
	PostStatsType,
	PostMediaAttachmentType,
	PostMentionObjectType,
} from './parsers/post.js';
// user services
export { UserParser, appUserObjectSchema } from './parsers/user.js';
export type { UserObjectType } from './parsers/user.js';
// notification services
export { NotificationParser } from './parsers/notification.js';
export type {
	NotificationObjectType,
	NotificationUserGroupType,
} from './parsers/notification.js';
// text node services
export { TextNodeParser } from './parsers/text-nodes.js';
export type { AppParsedTextNodes, NodeContent } from './parsers/text-nodes.js';

// pagination util
export { defaultResultPage } from './utils/pagination.js';
export type { ResultPage } from './utils/pagination.js';

export { AtprotoUtils } from './utils/atproto.js';
export { KeyExtractorUtil } from './utils/key-extractor.js';
export type { ApiResult } from './utils/api-result.js';
export type { DriverPostLikeState } from './types/driver.types.js';
export type { DriverUserFindQueryType } from './types/query.types.js';
