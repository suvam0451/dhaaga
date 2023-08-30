import { mastodon } from "@dhaaga/shared-provider-mastodon/src";
import { Note, UserDetailed } from "@dhaaga/shared-provider-misskey/src";

export type ActivityPubStatus = mastodon.v1.Status | Note;
export type ActivityPubStatuses = mastodon.v1.Status[] | Note[];
export type ActivityPubAccount = mastodon.v1.Account | UserDetailed;
