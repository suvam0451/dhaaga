import {
	AccountMutePostDto,
	AccountRouteStatusQueryDto,
	BookmarkGetQueryDTO,
	FollowerGetQueryDTO,
} from '#/client/typings.js';

export {
	type ApiTargetInterface,
	AtprotoApiAdapter,
	BaseApiAdapter,
	MastoApiAdapter,
	MisskeyApiAdapter,
	PleromaApiAdapter,
} from './client/index.js';

import ActivityPubService from './services/activitypub.service.js';
import ActivityPubReactionsService, {
	type ActivityPubReactionItemType,
	type ActivityPubReactionStateType,
} from './services/activitypub-reactions.service.js';
//  status adapters
import PostAdapterBase from './implementors/status/default.js';
import MastoApiPostAdapter from './implementors/status/mastodon.js';
import MisskeyApiPostAdapter from './implementors/status/misskey.js';
import ActivitypubHelper from './services/activitypub.js';
// used to read viewer
import AtprotoPostAdapter from './implementors/status/bluesky.js';
import { DriverService } from './services/driver.js';

export { ActivityPubService };
export { ActivityPubReactionsService };
export type { ActivityPubReactionStateType, ActivityPubReactionItemType };

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

export type { MfmNode } from './services/index.js';
export { AtprotoPostService, AtprotoFeedService } from './services/index.js';

export { UserDetailedInstance } from './implementors/profile/_interface.js';
export { AccountInstance } from './implementors/profile/_interface.js';
export { ActivitypubStatusAdapter } from './implementors/status/_adapters.js';

export { ActivitypubHelper };
export { parseStatusContent, preprocessPostContent } from './services/index.js';

// DTOs
export type {
	AccountMutePostDto,
	AccountRouteStatusQueryDto,
	BookmarkGetQueryDTO,
	FollowerGetQueryDTO,
};

export {
	DriverNotificationType,
	KNOWN_SOFTWARE,
} from './client/utils/driver.js';

export * from './utils/index.js';
export * from './parsers/index.js';
export * from './viewers/index.js';
export * from './mutators/index.js';

// post services
export { PostInspector, PostResolver } from './parsers/post.js';
export type { AppParsedTextNodes, NodeContent } from './parsers/text-nodes.js';

export { AtprotoUtils } from './utils/atproto.js';
export { KeyExtractorUtil } from './utils/key-extractor.js';
export type { DriverPostLikeState } from './types/driver.types.js';
export type { DriverUserFindQueryType } from './types/query.types.js';
export { defaultResultPage, type ResultPage } from './types/api-response.js';

export * from './types/shared/_exports.js';

export type {
	GetPostsQueryDTO,
	DhaagaJsTimelineQueryOptions,
} from '#/client/typings.js';

export { postObjectSchema } from './types/shared/post.js';
export { BaseUrlNormalizationService } from './utils/urls.js';
