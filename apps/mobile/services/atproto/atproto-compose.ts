import { AtprotoApiAdapter } from '@dhaaga/bridge';
import { MessageView } from '@atproto/api/dist/client/types/chat/bsky/convo/defs';
import { generateFacets } from '#/utils/atproto-facets.utils';
import {
	BlobRef,
	Facet,
	AppBskyRichtextFacet,
	Agent,
	AppBskyFeedDefs,
} from '@atproto/api';
import { PostComposerReducerStateType } from '#/features/composer/reducers/composer.reducer';
import MediaUtils from '#/utils/media.utils';
import { AppBskyFeedPost } from '@atproto/api/src/client';
import { PostInspector } from '@dhaaga/bridge';

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
	private static async getPost(client: AtprotoApiAdapter, uri: string) {
		return client.posts.getPost(uri);
	}

	/**
	 * shared function to post and return preview forn
	 * @param client
	 * @param record
	 * @private
	 */
	private static async post(
		client: AtprotoApiAdapter,
		record: AtProtoPostRecordType,
	) {
		const agent = client.getAgent();
		return await agent.post(record);
	}

	static async resolveMentions(agent: Agent, items: Facet[]) {
		const pending: { index: number; pointer: number; handle: string }[] = [];
		let count = 0;
		for (let i = 0; i < items.length; i++) {
			const target = items[i].features[0];
			if (AppBskyRichtextFacet.isMention(target)) {
				pending.push({
					index: count++,
					pointer: i,
					handle: target.did,
				});
			}
		}
		const handles = await Promise.all(
			pending.map((item) => agent.resolveHandle({ handle: item.handle })),
		);
		for (let i = 0; i < pending.length; i++) {
			items[pending[i].pointer].features[0].did = handles[i].data.did;
		}
		return items;
	}

	/**
	 * Generate post-record from reducer state
	 * @param client
	 * @param state
	 */
	static async postUsingReducerState(
		client: AtprotoApiAdapter,
		state: PostComposerReducerStateType,
	): Promise<AppBskyFeedDefs.PostView> {
		const agent = client.getAgent();

		let record: Partial<AppBskyFeedPost.Record> &
			Omit<AppBskyFeedPost.Record, 'createdAt'> = {};

		if (state.text) {
			record.text = state.text;
			record.facets = await this.resolveMentions(
				agent,
				generateFacets(state.text),
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

		if (state.parent) {
			const _replyTarget = PostInspector.getContentTarget(state.parent);
			if (state.isQuote) {
				// handle quotes
				record.embed = {
					$type: 'app.bsky.embed.record',
					record: {
						uri: _replyTarget.meta.uri,
						cid: _replyTarget.meta.cid,
					},
				};
			} else {
				// handle reply
				record.reply = {
					root: _replyTarget.rootPost
						? {
								uri: _replyTarget.rootPost.meta.uri,
								cid: _replyTarget.rootPost.meta.cid,
							}
						: {
								uri: _replyTarget.meta.uri,
								cid: _replyTarget.meta.cid,
							},
					parent: {
						uri: _replyTarget.meta.uri,
						cid: _replyTarget.meta.cid,
					},
				};
			}
		}

		const result = await this.post(client, record);

		/**
		 * Thanks Graysky again!
		 */
		if (state.threadGates.length > 0) {
			const _none = state.threadGates.find((v) => v.type === 'nobody');
			if (_none) return await this.getPost(client, result.uri);
			const allow = [];

			for (const rule of state.threadGates) {
				if (rule.type === 'mentioned') {
					allow.push({ $type: 'app.bsky.feed.threadgate#mentionRule' });
				} else if (rule.type === 'following') {
					allow.push({ $type: 'app.bsky.feed.threadgate#followingRule' });
				} else if (rule.type === 'list') {
					allow.push({
						$type: 'app.bsky.feed.threadgate#listRule',
						list: rule.list,
					});
				}
			}

			await agent.app.bsky.feed.threadgate.create(
				{ repo: agent.session!.did, rkey: result.uri.split('/').pop() },
				{ post: result.uri, createdAt: new Date().toISOString(), allow },
			);
		}

		return await this.getPost(client, result.uri);
	}

	static async chat(
		client: AtprotoApiAdapter,
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
			const room = await client.posts.getConvoForMembers(members);
			id = room.data.convo.id;
		}

		const msgData = await client.posts.sendMessage(id, text);
		return msgData.data;
	}
}

export default AtprotoComposerService;
