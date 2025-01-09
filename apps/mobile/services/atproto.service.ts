import BlueskyRestClient from '@dhaaga/bridge/dist/adapters/_client/bluesky';
import { ViewerState } from '@atproto/api/dist/client/types/app/bsky/feed/defs';
import { ActivityPubClient } from '@dhaaga/bridge';

class AtprotoService {
	/**
	 * toggle like for an at proto post
	 */
	static async toggleLike(
		client: ActivityPubClient,
		uri: string,
		cid: string,
		viewer: ViewerState,
	) {
		const _client = client as BlueskyRestClient;
		if (viewer.like === undefined) {
			const result = await _client.statuses.atProtoLike(uri, cid);
			if (result.success)
				return { state: result.liked, uri: result.uri, success: true };
			return { state: !!viewer.like, uri: viewer?.like, success: false };
		}

		const result = await _client.statuses.atProtoDeleteLike(viewer.like);
		if (result.success) return { state: result.liked, success: true };
		return { state: !!viewer.like, uri: viewer?.like, success: false };
	}
}

export default AtprotoService;
