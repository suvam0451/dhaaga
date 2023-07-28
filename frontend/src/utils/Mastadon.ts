import { mastodon } from "masto";

export function resolveProfileUrl(account: mastodon.v1.Account) {
	const ex = /^https:\/\/(.*?)\/u\/(.*?)$/;
	if (!ex.test(account.url)) {
		return {
			serverName: null,
			serverUrl: null,
			username: null,
		};
	}

	const match = account.url.match(ex)!;
	return {
		serverName: match[1],
		serverUrl: `https://${match[1]}/`,
		username: match[2],
    // usernameAtServer: match,
    usernameAtServer: `@${match[2]}@${match[1]}`
	};
}
