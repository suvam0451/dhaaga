import { mastodon } from "@dhaaga/shared-provider-mastodon/dist";
import { Note } from "@dhaaga/shared-provider-misskey/dist";

export type ActivityPubStatus = mastodon.v1.Status | Note;
export type ActivityPubStatuses = mastodon.v1.Status[] | Note[];
