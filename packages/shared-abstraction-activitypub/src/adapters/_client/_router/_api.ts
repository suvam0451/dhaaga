import { Agent, AtpSessionData, CredentialSession } from '@atproto/api';

export function getBskyAgent(dto: AtpSessionData): Agent {
	// Fill the session
	const session = new CredentialSession(
		new URL('https:/bsky.social'),
		fetch,
		(evt, session1) => {
			// console.log('[INFO]: session obtained', evt, session1);
		},
	);
	session.session = dto;

	return new Agent(session);
}
