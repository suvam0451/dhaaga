import BlueskyRestClient from '@dhaaga/bridge/dist/adapters/_client/bluesky';
import { ViewerState } from '@atproto/api/dist/client/types/app/bsky/feed/defs';
import { ActivityPubClient } from '@dhaaga/bridge';
import {
	AppBskyActorDefs,
	AppBskyActorGetPreferences,
	Facet,
} from '@atproto/api';
import { AppParsedTextNodes } from '../types/parsed-text.types';
import { RandomUtil } from '../utils/random.utils';

export type AppSavedPrefDate = AppBskyActorGetPreferences.OutputSchema;

class AtprotoPostService {
	/**
	 * toggle like for an at proto post object
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

	/**
	 * toggle sharing status for an at proto post object
	 */
	static async toggleRepost(
		client: ActivityPubClient,
		uri: string,
		cid: string,
		viewer: ViewerState,
	) {
		const _client = client as BlueskyRestClient;
		if (viewer.repost === undefined) {
			const result = await _client.statuses.atProtoRepost(uri, cid);
			if (result.success)
				return { state: result.liked, uri: result.uri, success: true };
			return { state: !!viewer.repost, uri: viewer?.repost, success: false };
		}

		const result = await _client.statuses.atProtoDeleteRepost(viewer.repost);
		if (result.success) return { state: result.liked, success: true };
		return { state: !!viewer.repost, uri: viewer?.repost, success: false };
	}
}

class AtprotoFeedService {
	/**
	 * Helper function to get saved feeds
	 * from an AT proto preference (saved or fetched)
	 * @param pref
	 */
	static extractFeedPreferences(pref: AppSavedPrefDate) {
		const match = pref.preferences.find(AppBskyActorDefs.isSavedFeedsPrefV2);
		return match ? match.items : [];
	}
}

class Service {
	static toUtf8(input: string): Uint8Array {
		const encoder = new TextEncoder();
		return encoder.encode(input);
	}

	static toUtf16(input: Uint8Array): string {
		// Optionally decode back to string
		const decoder = new TextDecoder('utf-8');
		return decoder.decode(input);
	}

	/**
	 * process the facet nodes, as marked in record
	 * and return app compatible AST
	 * @param input
	 * @param facets
	 */
	static processTextContent(
		input: string,
		facets: Facet[],
	): AppParsedTextNodes {
		if (!input) return [];

		const byteArray: Uint8Array = Service.toUtf8(input);

		const elements = [];
		let idx = 0,
			count = 0;

		elements.push({
			uuid: RandomUtil.nanoId(),
			type: 'para',
			nodes: [],
		});

		for (const facet of facets) {
			// The raw text segments between facet segments
			const prefix = byteArray.slice(idx, facet.index.byteStart);
			elements[0].nodes.push({
				uuid: RandomUtil.nanoId(),
				nodes: [],
				type: 'text',
				text: Service.toUtf16(prefix),
			});
			count++;

			const midSegment = byteArray.slice(
				facet.index.byteStart,
				facet.index.byteEnd,
			);
			switch (facet.features[0].$type) {
				case 'app.bsky.richtext.facet#mention': {
					elements[0].nodes.push({
						type: 'mention',
						uuid: RandomUtil.nanoId(),
						text: Service.toUtf16(midSegment),
						url: facet.features[0]?.did,
						nodes: [],
					});
					break;
				}
				case 'app.bsky.richtext.facet#link': {
					elements[0].nodes.push({
						type: 'link',
						uuid: RandomUtil.nanoId(),
						text: Service.toUtf16(midSegment),
						url: facet.features[0]?.uri,
						nodes: [],
					});
					break;
				}
				case 'app.bsky.richtext.facet#tag': {
					elements[0].nodes.push({
						type: 'tag',
						uuid: RandomUtil.nanoId(),
						text: Service.toUtf16(midSegment),
						url: facet.features[0]?.tag,
						nodes: [],
					});

					break;
				}
			}
			count++;
			idx = facet.index.byteEnd;
		}

		// The suffix raw text segment
		const suffix = byteArray.slice(idx);
		elements[0].nodes.push({
			uuid: RandomUtil.nanoId(),
			nodes: [],
			type: 'text',
			text: Service.toUtf16(suffix),
		});

		return elements;
	}
}

export { Service as AtprotoService, AtprotoPostService, AtprotoFeedService };
