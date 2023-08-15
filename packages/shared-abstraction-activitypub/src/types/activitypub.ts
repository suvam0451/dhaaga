import { mastodon } from "@dhaaga/shared-provider-mastodon/src";
import { Note } from "@dhaaga/shared-provider-misskey/src";

export type ActivityPubStatus = mastodon.v1.Status | Note;
export type ActivityPubStatuses = mastodon.v1.Status[] | Note[];
