import {
	NodeOAuthClient,
	NodeSavedSession,
	NodeSavedState,
	// @ts-ignore=next-line
} from '@atproto/oauth-client-node';

export class AtprotoUtils {
	static buildClient() {
		return NodeOAuthClient.fromClientId({
			clientId: 'https://suvam.io/dhaaga/client-metadata.json',
			stateStore: {
				async set(key: string, internalState: NodeSavedState): Promise<void> {},
				async get(key: string): Promise<NodeSavedState | undefined> {
					return undefined;
				},
				async del(key: string): Promise<void> {},
			},
			sessionStore: {
				async set(sub: string, session: NodeSavedSession): Promise<void> {},
				async get(sub: string): Promise<NodeSavedSession | undefined> {
					return undefined;
				},
				async del(sub: string): Promise<void> {},
			},
		});
	}
}
