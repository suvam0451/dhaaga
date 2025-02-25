import { KNOWN_SOFTWARE } from '@dhaaga/bridge';

const MISSKEY_LOCAL_EX = /:(.*?):/; // :foo:
const MISSKEY_LOCAL_ALT_EX = /:(.*?)@.:/; // :foo@.:
const MISSKEY_REMOTE_EX = /:(.*?)@(.*?):/; // :foo@bar:
const PLEROMA_REMOTE_EX = /(.*?)@(.*?)/;
// unicode

class Service {
	static resolveReactionCode(
		input: string,
		driver: KNOWN_SOFTWARE,
		server: string,
	) {}
}

export { Service as ReactionService };
