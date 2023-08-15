import {
	NoteInstance,
	NoteToStatusAdapter,
	StatusInstance,
	StatusInterface,
	StatusToStatusAdapter,
	UnknownToStatusAdapter,
} from "@dhaaga/shared-abstraction-activitypub/src";
import { mastodon } from "@dhaaga/shared-provider-mastodon/src";
import { Note } from "@dhaaga/shared-provider-misskey/src";

/**
 *
 * @param status
 * @param domain
 * @returns
 */
export function adaptSharedProtocol(
	status: any,
	domain: string
): StatusInterface {
	switch (domain) {
		case "misskey": {
			return new NoteToStatusAdapter(new NoteInstance(status as Note));
		}
		case "mastodon": {
			return new StatusToStatusAdapter(
				new StatusInstance(status as mastodon.v1.Status)
			);
		}
		default: {
			return new UnknownToStatusAdapter();
		}
	}
}
