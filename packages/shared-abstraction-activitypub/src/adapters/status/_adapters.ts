import MisskeyToStatusAdapter, {
	MisskeyToStatusContextAdapter,
} from './misskey.js';
import type { Note } from 'misskey-js/autogen/models.js';
import MastodonToStatusAdapter, {
	MastodonToStatusContextAdapter,
} from './mastodon.js';
import { mastodon } from '@dhaaga/shared-provider-mastodon';
import UnknownToStatusAdapter, {
	UnknownToStatusContextAdapter,
} from './default.js';
import {
	NoteInstance,
	StatusContextInstance,
	StatusContextInterface,
	StatusInstance,
	StatusInterface,
} from './_interface.js';
import { KNOWN_SOFTWARE } from '../_client/_router/routes/instance.js';
import camelcaseKeys from 'camelcase-keys';
import BlueskyStatusAdapter from './bluesky.js';

/**
 * @param status any status object
 * @param domain domain from database
 * @returns StatusInterface
 */
export function ActivitypubStatusAdapter(
	status: any,
	domain: string,
): StatusInterface {
	switch (domain) {
		case KNOWN_SOFTWARE.MISSKEY:
		case KNOWN_SOFTWARE.FIREFISH:
		case KNOWN_SOFTWARE.SHARKEY:
		case KNOWN_SOFTWARE.MEISSKEY:
		case KNOWN_SOFTWARE.KMYBLUE:
		case KNOWN_SOFTWARE.CHERRYPICK: {
			return new MisskeyToStatusAdapter(new NoteInstance(status as Note));
		}

		case KNOWN_SOFTWARE.MASTODON: {
			return new MastodonToStatusAdapter(
				new StatusInstance(status as mastodon.v1.Status),
			);
		}

		case KNOWN_SOFTWARE.PLEROMA:
		case KNOWN_SOFTWARE.AKKOMA: {
			const _camel = camelcaseKeys(status, { deep: true });
			return new MastodonToStatusAdapter(
				new StatusInstance(_camel as mastodon.v1.Status),
			);
		}
		case KNOWN_SOFTWARE.BLUESKY: {
			// console.log(status);
			return new BlueskyStatusAdapter({
				post: status,
				reply: status.reply,
				reason: status.reason,
			});
		}
		default: {
			return new UnknownToStatusAdapter();
		}
	}
}

export function ActivityPubStatusContextAdapter(
	status: any,
	domain: string,
): StatusContextInterface {
	switch (domain) {
		case KNOWN_SOFTWARE.MISSKEY:
		case KNOWN_SOFTWARE.FIREFISH:
		case KNOWN_SOFTWARE.MEISSKEY:
		case KNOWN_SOFTWARE.KMYBLUE:
		case KNOWN_SOFTWARE.CHERRYPICK: {
			const postInstance = new NoteInstance(status as Note);
			const postInterface = new MisskeyToStatusAdapter(postInstance);
			const ctxInstance = new StatusContextInstance(postInterface);
			return new MisskeyToStatusContextAdapter(postInterface, ctxInstance);
		}
		case KNOWN_SOFTWARE.MASTODON: {
			const postInstance = new StatusInstance(status as mastodon.v1.Status);
			const postInterface = new MastodonToStatusAdapter(postInstance);
			const ctxInstance = new StatusContextInstance(postInterface);
			return new MastodonToStatusContextAdapter(postInterface, ctxInstance);
		}
		default: {
			const postInterface = new UnknownToStatusAdapter();
			const ctxInstance = new StatusContextInstance(postInterface);
			return new UnknownToStatusContextAdapter(postInterface, ctxInstance);
		}
	}
}
