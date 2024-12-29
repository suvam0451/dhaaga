import BlueskyRestClient from '@dhaaga/bridge/dist/adapters/_client/bluesky';
import { DhaagaJsPostCreateDto } from '@dhaaga/bridge/dist/adapters/_client/_router/routes/statuses';
import { MessageView } from '@atproto/api/dist/client/types/chat/bsky/convo/defs';
import { ThreadViewPost } from '@atproto/api/dist/client/types/app/bsky/feed/defs';

type AtprotoImageEmbed = {
	alt: string;
	image: Blob;
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
	private static async submit(
		client: BlueskyRestClient,
		dto: DhaagaJsPostCreateDto,
	) {
		const { data, error } = await client.statuses.create(dto);
		if (error) {
			return null;
		}
		const { data: postThreadData, error: postThreadError } =
			await client.statuses.get(data.uri);

		if (postThreadError) return null;
		return postThreadData.data.thread;
	}
	static async post(
		client: BlueskyRestClient,
		text: string,
		embeds: {
			images?: AtprotoImageEmbed[];
			quote?: AtprotoPostEmbed;
			reply?: AtprotoReplyEmbed;
		},
	): Promise<ThreadViewPost> {
		const agent = client.getAgent();

		let postData: { uri: string; cid: string } = null;

		if (embeds.reply) {
			postData = await agent.post({
				text,
				reply: embeds.reply,
			});
		} else if (embeds.quote) {
		} else if (embeds.images) {
		} else {
			postData = await agent.post({
				text,
			});
		}

		if (!postData) return null;

		const { data: postThreadData, error: postThreadError } =
			await client.statuses.get(postData.uri);
		return postThreadData.data.thread as ThreadViewPost;
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
