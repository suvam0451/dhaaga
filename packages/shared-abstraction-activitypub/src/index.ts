import { RestClientCreateDTO } from './adapters/_client/_interface.js';
import ActivityPubClient from './adapters/_client/_interface.js';
import UnknownRestClient from './adapters/_client/default/index.js';
import MastodonRestClient from './adapters/_client/mastodon/index.js';
import MisskeyRestClient from './adapters/_client/misskey/index.js';

//  status adapters
import UnknownToStatusAdapter from './adapters/status/default.js';
import MastodonToStatusAdapter from './adapters/status/mastodon.js';
import MisskeyToStatusAdapter from './adapters/status/misskey.js';

export {
	UnknownToStatusAdapter,
	MastodonToStatusAdapter,
	MisskeyToStatusAdapter,
	ActivityPubClient,
};

// export media attachment adapters and interfaces
export {
	DriveFileToMediaAttachmentAdapter,
	MediaAttachmentToMediaAttachmentAdapter,
	UnknownToMediaAttachmentAdapter,
} from './adapters/media-attachment/adapter.js';
export {
	DriveFileInstance,
	MediaAttachmentInstance,
} from './adapters/media-attachment/unique.js';
export { MediaAttachmentInterface } from './adapters/media-attachment/interface.js';

// export user profile adapters and interfaces
export { DefaultUser } from './adapters/profile/default.js';

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
} from './adapters/profile/_interface.js';
export { StatusInterface } from './adapters/status/_interface.js';
export {
	ActivityPubTagAdapter,
	TagInterface,
	TagType,
} from './adapters/tag/_interface.js';

export { MastodonRestClient, MisskeyRestClient, UnknownRestClient };
export {
	DhaagaJsTimelineQueryOptions,
	DhaagaJsNotificationType,
} from './adapters/_client/_router/routes/_index.js';

const userMap = {
	mastodon: MastodonRestClient,
	misskey: MisskeyRestClient,
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
		return new userMap[domain](payload);
	}
}

export {
	LibraryResponse,
	DhaagaErrorCode,
} from './adapters/_client/_router/_types.js';

export { StatusInstance } from './adapters/status/_interface.js';
export { NoteInstance } from './adapters/status/_interface.js';
export { UserDetailedInstance } from './adapters/profile/_interface.js';
export { AccountInstance } from './adapters/profile/_interface.js';
export { ActivitypubStatusAdapter } from './adapters/status/_adapters.js';
import ActivitypubHelper from './services/activitypub.js';

export { ActivitypubHelper };
export { parseStatusContent, preprocessPostContent } from './services/index.js';
