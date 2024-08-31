import {
	ActivityPubClient,
	InstanceApi_CustomEmojiDTO,
	PleromaRestClient,
} from '@dhaaga/shared-abstraction-activitypub';
import { EmojiDto } from '../../components/common/status/fragments/_shared.types';
import ActivityPubService from '../activitypub.service';
import { Dispatch, SetStateAction } from 'react';
import { z } from 'zod';

const MISSKEY_LOCAL_EX = /:(.*?):/;
const MISSKEY_LOCAL_ALT_EX = /:(.*?)@.:/;
const MISSKEY_REMOTE_EX = /:(.*?)@(.*?):/;
const PLEROMA_REMOTE_EX = /(.*?)@(.*?)/;

export const ActivityPubReactionStateDto = z.array(
	z.object({
		id: z.string(),
		count: z.number().positive(),
		me: z.boolean(),
		accounts: z.array(z.string()),
		url: z.string().nullable().optional(),
	}),
);

export type ActivityPubReactionStateDtoType = z.infer<
	typeof ActivityPubReactionStateDto
>;

class ActivityPubReactionsService {
	/**
	 * :blob: --> { id: blob }
	 * :blob@misskey.io: --> { id: blob, subdomain: misskey.io }
	 * @param input
	 * @param subdomain
	 */
	static extractReactionCode(input: string, subdomain: string) {
		if (MISSKEY_LOCAL_EX.test(input)) {
			const _name = MISSKEY_LOCAL_EX.exec(input)[1];
			return { id: _name };
		}
		return { id: input };
	}
	/**
	 * Local, Misskey --> :emoji@.:
	 * Remote, Misskey --> :emoji@subdomain:
	 * Local, Pleroma --> emoji
	 * Remote, Pleroma --> emoji@subdomain
	 */
	static renderData(
		input: ActivityPubReactionStateDtoType,
		{
			me,
			calculated,
			cache,
		}: {
			calculated: {
				url?: string;
				width?: number;
				height?: number;
				name?: string;
			}[];
			cache: InstanceApi_CustomEmojiDTO[];
			me: string;
		},
	) {
		let retval: EmojiDto[] = [];

		for (const reaction of input) {
			console.log(reaction);
			let IS_ME = false;
			if (reaction.accounts && reaction.accounts.includes(me)) {
				IS_ME = true;
			}

			const IS_REMOTE =
				MISSKEY_REMOTE_EX.test(reaction.id) ||
				PLEROMA_REMOTE_EX.test(reaction.id);

			const BASE = {
				name: reaction.id,
				count: reaction.count,
				interactable: !IS_REMOTE,
				me: IS_ME,
			};

			if (MISSKEY_LOCAL_ALT_EX.test(reaction.id)) {
				// [Misskey] [Local] emoji (search in cache)
				const _name = MISSKEY_LOCAL_ALT_EX.exec(reaction.id)[1];
				const match = cache.find(
					(o) => o.shortCode === _name || o.aliases.includes(_name),
				);
				if (!match) {
					console.log('[WARN]: local emoji not found for', _name);
					continue;
				}
				console.log({
					...BASE,
					type: 'image',
					url: match.url,
				});

				retval.push({
					...BASE,
					type: 'image',
					url: match.url,
				});
			} else if (MISSKEY_REMOTE_EX.test(reaction.id)) {
				// [Misskey] [Remote] reaction (search in payload)
				const match = calculated.find((o) => o.name === reaction.id);
				if (!match) {
					console.log('[WARN]: failed to resolve remote misskey reaction');
					continue;
				}
				retval.push({
					...BASE,
					type: 'image',
					url: match.url,
					width: match.width,
					height: match.height,
				});
			} else if (MISSKEY_LOCAL_EX.test(reaction.id)) {
				const _name = MISSKEY_LOCAL_EX.exec(reaction.id)[1];
				const match = calculated.find((o) => o.name === _name);
				const cacheHit = cache.find(
					(o) => o.shortCode === _name || o.aliases.includes(_name),
				);
				if (!match?.url && !cacheHit) {
					console.log('[WARN]: failed to resolve local misskey emoji');
					continue;
				}
				retval.push({
					...BASE,
					type: 'image',
					url: match?.url || cacheHit?.url,
					width: match?.width,
					height: match?.height,
				});
			} else if (PLEROMA_REMOTE_EX.test(reaction.id)) {
				// [Pleroma] [Remote] reaction (search in url)
				const match = calculated.find((o) => o.name === reaction.id);
				if (!match && !reaction.url) {
					console.log('[WARN]: failed to resolve remote pleroma reaction');
					continue;
				}
				retval.push({
					...BASE,
					type: 'image',
					url: reaction.url || match?.url,
					width: match?.width,
					height: match?.height,
				});
			} else {
				// [Pleroma] local reaction or text (search in cache/url)
				const cacheHit = cache.find(
					(o) => o.shortCode === reaction.id || o.aliases.includes(reaction.id),
				);
				if (cacheHit || reaction.url) {
					retval.push({
						name: reaction.id,
						count: reaction.count,
						type: 'image',
						url: reaction.url || cacheHit?.url,
						interactable: true,
						me: reaction.me,
					});
				} else {
					retval.push({
						name: reaction.id,
						count: reaction.count,
						type: 'text',
						interactable: true,
						me: reaction.me,
					});
				}
			}
		}

		return retval;
	}

	static async removeReaction(
		client: ActivityPubClient,
		postId: string,
		reactionId: string,
		domain: string,
		setLoading: Dispatch<SetStateAction<boolean>>,
	) {
		setLoading(true);
		if (ActivityPubService.pleromaLike(domain)) {
			const { data, error } = await (
				client as PleromaRestClient
			).statuses.removeReaction(postId, reactionId);
			if (error) {
				console.log('[WARN]: failed to add reaction', error);
				return null;
			}

			setLoading(false);
			return data.emojiReactions.map((o) => ({
				id: o.name.length > 2 ? `:${o.name}:` : o.name,
				me: o.me,
				count: o.count,
				accounts: o.accounts || [],
			}));
		}
		return null;
	}

	static async addReaction(
		client: ActivityPubClient,
		postId: string,
		reactionId: string,
		domain: string,
		setLoading: Dispatch<SetStateAction<boolean>>,
	): Promise<ActivityPubReactionStateDtoType> {
		setLoading(true);
		if (ActivityPubService.pleromaLike(domain)) {
			const { data, error } = await (
				client as PleromaRestClient
			).statuses.addReaction(postId, reactionId);

			if (error) {
				console.log('[WARN]: failed to add reaction', error);
				return null;
			}

			setLoading(false);
			return data.emojiReactions.map((o) => ({
				id: o.name.length > 2 ? `:${o.name}:` : o.name,
				me: o.me,
				count: o.count,
				accounts: o.accounts || [],
			}));
		}
		return null;
	}
}

export default ActivityPubReactionsService;
