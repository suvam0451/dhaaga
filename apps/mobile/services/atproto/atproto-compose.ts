import BlueskyRestClient from '@dhaaga/bridge/dist/adapters/_client/bluesky';
import { MessageView } from '@atproto/api/dist/client/types/chat/bsky/convo/defs';
import { ThreadViewPost } from '@atproto/api/dist/client/types/app/bsky/feed/defs';
import {
	ATPROTO_FACET_ENUM,
	detectFacets,
} from '../../utils/atproto-facets.utils';
import { AtpAgent, BlobRef, Facet } from '@atproto/api';
import { PostComposerReducerStateType } from '../../states/reducers/post-composer.reducer';
import MediaUtils from '../../utils/media.utils';
import { AppBskyFeedPost } from '@atproto/api/src/client';

type AtProtoPostRecordType = Partial<AppBskyFeedPost.Record> &
	Omit<AppBskyFeedPost.Record, 'createdAt'>;

export type AtprotoImageEmbed = {
	alt: string;
	image: BlobRef;
	aspectRatio: {
		width: number;
		height: number;
	};
};

type AtprotoPostEmbed = {
	uri: string;
	cid: string;
};

export type AtprotoReplyEmbed = {
	root: {
		uri: string;
		cid: string;
	};
	parent: {
		uri: string;
		cid: string;
	};
};

class AtprotoComposerService {
	/**
	 * shared function to post and return preview forn
	 * @param client
	 * @param record
	 * @private
	 */
	private static async post(
		client: BlueskyRestClient,
		record: AtProtoPostRecordType,
	) {
		const agent = client.getAgent();
		try {
			const result: AtprotoPostEmbed = await agent.post(record);
			const { data, error } = await client.statuses.get(result.uri);
			if (error) {
				console.log('[WARN]: failed to fetch freshly created post');
				return null;
			}
			return data.data.thread as ThreadViewPost;
		} catch (e) {
			console.log('[WARN]: failed to create post:', record, e);
			return null;
		}
	}

	static async resolveMentions(agent: AtpAgent, items: Facet[]) {
		const pending: { index: number; pointer: number; handle: string }[] = [];
		let count = 0;
		for (let i = 0; i < items.length; i++) {
			if (items[i].features[0].$type === ATPROTO_FACET_ENUM.MENTION) {
				pending.push({
					index: count++,
					pointer: i,
					handle: items[i].features[0].did as string,
				});
			}
		}
		const handles = await Promise.all(
			pending.map((item) => agent.resolveHandle({ handle: item.handle })),
		);
		console.log(handles);
		for (let i = 0; i < pending.length; i++) {
			items[pending[i].pointer].features[0].did = handles[i].data.did;
		}
		return items;
	}

	static async postUsingReducerState(
		client: BlueskyRestClient,
		state: PostComposerReducerStateType,
	): Promise<ThreadViewPost> {
		const agent = client.getAgent();

		let record: Partial<AppBskyFeedPost.Record> &
			Omit<AppBskyFeedPost.Record, 'createdAt'> = {};

		if (state.text) {
			record.text = state.text;
			record.facets = await this.resolveMentions(
				agent,
				detectFacets(state.text),
			);
		}

		if (state.cw) {
			record.cw;
		}

		if (state.medias.length > 0) {
			/**
			 * Upload Media Attachments
			 */
			const uploadedImageBlobData = await Promise.all(
				state.medias.map((o) => MediaUtils.uploadBlob(agent, o.localUri)),
			);
			const mediaAttachmentObject: AtprotoImageEmbed[] = [];
			for (let i = 0; i < state.medias.length; i++) {
				const _alt = state.medias[i].localAlt;
				mediaAttachmentObject.push({
					alt: _alt === null ? undefined : _alt,
					aspectRatio: {
						height: 1,
						width: 1,
					},
					image: uploadedImageBlobData[0].data.blob,
				});
			}
			record.embed = {
				$type: 'app.bsky.embed.images',
				images: mediaAttachmentObject,
			};
		}

		// handle reply

		// handle quotes

		return this.post(client, record);
	}

	static async chat(
		client: BlueskyRestClient,
		{
			id,
			members,
		}: {
			id?: string;
			members: string[];
		},
		text: string,
	): Promise<MessageView> {
		if (!id) {
			const { data: room, error: roomError } =
				await client.statuses.getConvoForMembers(members);
			if (roomError) return null;
			id = room.data.convo.id;
		}

		const { data: msgData, error: msgError } =
			await client.statuses.sendMessage(id, text);
		if (msgError) return null;
		return msgData.data;
	}
}

export default AtprotoComposerService;
