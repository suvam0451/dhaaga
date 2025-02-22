import ApiDriver, {
	RestClientCreateDTO,
} from './adapters/_client/_interface.js';
import UnknownRestClient from './adapters/_client/default/index.js';
import MastodonRestClient from './adapters/_client/mastodon/_router.js';
import MisskeyRestClient from './adapters/_client/misskey/_router.js';

//  status adapters
import UnknownToStatusAdapter from './implementors/status/default.js';
import MastodonToStatusAdapter from './implementors/status/mastodon.js';
import MisskeyToStatusAdapter from './implementors/status/misskey.js';
import ActivitypubHelper from './services/activitypub.js';
import { InstanceApi_CustomEmojiDTO } from './adapters/_client/_router/routes/instance.js';
import axios from 'axios';
import { UserDetailed } from 'misskey-js/autogen/models.js';
import PleromaRestClient from './adapters/_client/pleroma/_router.js';
import BlueskyRestClient from './adapters/_client/bluesky/index.js';
import { errorBuilder } from './adapters/_client/_router/dto/api-responses.dto.js';
import { LibraryPromise } from './adapters/_client/_router/routes/_types.js';
import {
	AccountMutePostDto,
	AccountRouteStatusQueryDto,
	BookmarkGetQueryDTO,
	FollowerGetQueryDTO,
} from './adapters/_client/_router/routes/accounts.js';
// used to read viewer
import BlueskyStatusAdapter from './implementors/status/bluesky.js';
import { KNOWN_SOFTWARE } from './data/driver.js';
import { DriverService } from './services/driver.js';

export {
	UnknownToStatusAdapter,
	MastodonToStatusAdapter,
	MisskeyToStatusAdapter,
	BlueskyStatusAdapter,
	ApiDriver,
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
export { MediaAttachmentInterface } from './implementors/media-attachment/interface.js';

// export user profile adapters and interfaces
export { DefaultUser } from './implementors/profile/default.js';

// stub types
export {
	ActivityPubStatus,
	ActivityPubStatuses,
	ActivityPubAccount,
} from './types/activitypub.js';

// export types, adapters and interfaces
export {
	ActivityPubUserAdapter,
	UserInterface,
	UserType,
} from './implementors/profile/_interface.js';
export { StatusInterface } from './implementors/status/_interface.js';
export {
	ActivityPubTagAdapter,
	TagInterface,
	TagType,
} from './implementors/tag/_interface.js';

export {
	MastodonRestClient,
	MisskeyRestClient,
	UnknownRestClient,
	PleromaRestClient,
	BlueskyRestClient,
};
export { DhaagaJsTimelineQueryOptions } from './adapters/_client/_router/routes/_index.js';

export class ActivityPubClientFactory {
	static get(domain: KNOWN_SOFTWARE | string, payload: RestClientCreateDTO) {
		return DriverService.generateApiClient(domain, payload);
	}
}

export type { MfmNode } from './services/index.js';

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

export { LibraryPromise, errorBuilder };

// DTOs
export {
	AccountMutePostDto,
	AccountRouteStatusQueryDto,
	BookmarkGetQueryDTO,
	FollowerGetQueryDTO,
};

export { KNOWN_SOFTWARE, InstanceApi_CustomEmojiDTO };
export { DriverNotificationType } from './data/driver.js';
export { LibraryResponse } from './types/result.types.js';
export { ApiErrorCode } from './types/result.types.js';

export {
	RandomUtil,
	ResultOk,
	ResultErr,
	Result,
	AsyncResult,
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
export { PostParser, PostInspector, postObjectSchema } from './parsers/post.js';
export type {
	PostObjectType,
	PostRootObjectType,
	PostAuthorType,
	PostStatsType,
	PostMediaAttachmentType,
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
