import {RestClientCreateDTO} from "./adapters/_client/_interface";
import MastodonRestClient from "./adapters/_client/mastodon";
import MisskeyRestClient from "./adapters/_client/misskey";
import UnknownRestClient from "./adapters/_client/default";

//  status adapters
import UnknownToStatusAdapter from "./adapters/status/default";
import MastodonToStatusAdapter from "./adapters/status/mastodon"
import MisskeyToStatusAdapter from "./adapters/status/misskey"

export {UnknownToStatusAdapter, MastodonToStatusAdapter, MisskeyToStatusAdapter}
export {NoteInstance, StatusInstance} from "./adapters/status/unique";
export {StatusInterface} from "./adapters/status/_interface";

// export media attachment adapters and interfaces
export {
  DriveFileToMediaAttachmentAdapter,
  MediaAttachmentToMediaAttachmentAdapter,
  UnknownToMediaAttachmentAdapter,
} from "./adapters/media-attachment/adapter";
export {
  DriveFileInstance,
  MediaAttachmentInstance,
} from "./adapters/media-attachment/unique";
export {MediaAttachmentInterface} from "./adapters/media-attachment/interface";

// export user profile adapters and interfaces
export {UserDetailedToUserProfileAdapter} from "./adapters/profile/adapter";
export {
  UserDetailedInstance,
  AccountInstance,
} from "./adapters/profile/unique";
export {UserProfileInterface} from "./adapters/profile/interface";

// stub types
export {
  ActivityPubStatus,
  ActivityPubStatuses,
  ActivityPubAccount,
} from "./types/activitypub";

export {
  MastodonRestClient,
  MisskeyRestClient,
  UnknownRestClient
}

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
      payload: RestClientCreateDTO
  ): ClassType<K> {
    return new userMap[domain](payload);
  }
}
