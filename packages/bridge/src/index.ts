import ActivityPubClient, {
	FollowPostDto,
	GetPostsQueryDTO,
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
import {
	InstanceApi_CustomEmojiDTO,
	InstanceRoute,
	KNOWN_SOFTWARE,
} from './adapters/_client/_router/routes/instance.js';
import axios from 'axios';
import { UserDetailed } from 'misskey-js/autogen/models.js';
import PleromaRestClient from './adapters/_client/pleroma/_router.js';
import BlueskyRestClient from './adapters/_client/bluesky/index.js';
import { errorBuilder } from './adapters/_client/_router/dto/api-responses.dto.js';
import { LibraryPromise } from './adapters/_client/_router/routes/_types.js';
import {
	AccountMutePostDto,
	AccountRoute,
	AccountRouteStatusQueryDto,
	BookmarkGetQueryDTO,
	FollowerGetQueryDTO,
} from './adapters/_client/_router/routes/accounts.js';
import { BaseAccountsRouter } from './adapters/_client/default/accounts.js';
import {
	ListsRoute,
	MeRoute,
	MediaRoute,
	NotificationsRoute,
	ParserRoute,
	ProfileRoute,
	SearchRoute,
	StatusesRoute,
	TagRoute,
	TimelinesRoute,
	TrendsRoute,
} from './adapters/_client/_router/routes/_index.js';
import {
	MastoAccount,
	MastoFamiliarFollowers,
	MastoFeaturedTag,
	MastoList,
	MastoRelationship,
	MastoStatus,
} from './types/mastojs.types.js';
import {
	MegaAccount,
	MegaRelationship,
	MegaStatus,
} from './types/megalodon.types.js';
import { MissUserDetailed } from './types/misskey-js.types.js';
import BlueskyStatusAdapter from './implementors/status/bluesky.js';

export {
	UnknownToStatusAdapter,
	MastodonToStatusAdapter,
	MisskeyToStatusAdapter,
	BlueskyStatusAdapter,
	ActivityPubClient,
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
export {
	DhaagaJsTimelineQueryOptions,
	DhaagaJsNotificationType,
} from './adapters/_client/_router/routes/_index.js';

const userMap = {
	[KNOWN_SOFTWARE.BLUESKY]: BlueskyRestClient,
	// Pleroma Compat
	[KNOWN_SOFTWARE.AKKOMA]: PleromaRestClient,
	[KNOWN_SOFTWARE.PLEROMA]: PleromaRestClient,

	// Misskey Compat
	[KNOWN_SOFTWARE.FIREFISH]: MisskeyRestClient,
	[KNOWN_SOFTWARE.MISSKEY]: MisskeyRestClient,
	[KNOWN_SOFTWARE.SHARKEY]: MisskeyRestClient,

	// Mastodon Compat
	[KNOWN_SOFTWARE.MASTODON]: MastodonRestClient,
};

type UserMap = typeof userMap;
type Keys = keyof UserMap;
type Tuples<T> = T extends Keys ? [T, InstanceType<UserMap[T]>] : never;
type SingleKeys<K> = [K] extends (K extends Keys ? [K] : never) ? K : never;
type ClassType<A extends Keys> = Extract<Tuples<Keys>, [A, any]>[1];

export class ActivityPubClientFactory {
	static get<K extends Keys>(
		domain: SingleKeys<K>,
		payload: RestClientCreateDTO,
	): ClassType<K> {
		try {
			// FIXME: remove any
			return new userMap[domain](payload as any);
		} catch (e) {
			return new userMap[KNOWN_SOFTWARE.MASTODON](payload);
		}
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

// Routes
export {
	AccountRoute,
	InstanceRoute,
	ListsRoute,
	MeRoute,
	MediaRoute,
	NotificationsRoute,
	ParserRoute,
	ProfileRoute,
	SearchRoute,
	StatusesRoute,
	TagRoute,
	TimelinesRoute,
	TrendsRoute,
};

// Library Typings
export {
	FollowPostDto,
	GetPostsQueryDTO,
	MastoAccount,
	MastoFamiliarFollowers,
	MastoFeaturedTag,
	MastoList,
	MastoRelationship,
	MastoStatus,
	MegaAccount,
	MegaRelationship,
	MegaStatus,
	MissUserDetailed,
};

// DTOs
export {
	AccountMutePostDto,
	AccountRouteStatusQueryDto,
	BookmarkGetQueryDTO,
	FollowerGetQueryDTO,
};

// Template Routers
export { BaseAccountsRouter };

export { KNOWN_SOFTWARE, InstanceApi_CustomEmojiDTO };
export { LibraryResponse } from './types/result.types.js';
export { DhaagaErrorCode } from './types/result.types.js';
