import { mastodon } from 'masto';
import type { Note, UserDetailed } from 'misskey-js/autogen/models.js';

export type ActivityPubStatus = mastodon.v1.Status | Note;
export type ActivityPubStatuses = mastodon.v1.Status[] | Note[];
export type ActivityPubAccount = mastodon.v1.Account | UserDetailed;
