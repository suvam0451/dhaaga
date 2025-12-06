import ActivityPubService from './activitypub.service.js';
import { Dispatch, SetStateAction } from 'react';
import { z } from 'zod';
import activitypubService from './activitypub.service.js';
import {
	ApiTargetInterface,
	MisskeyApiAdapter,
	PleromaApiAdapter,
} from '../client/index.js';
import { PostParser } from '../parsers/post.js';
import { DriverReactionResolvedType } from '../types/activitypub.js';
import { CustomEmojiObject } from '#/types/shared/reactions.js';

const MISSKEY_LOCAL_EX = /:(.*?):/;
const MISSKEY_LOCAL_ALT_EX = /:(.*?)@.:/;
const MISSKEY_REMOTE_EX = /:(.*?)@(.*?):/;
const PLEROMA_REMOTE_EX = /(.*?)@(.*?)/;

const pleromaReactionItemSchema = z.object({
	count: z.number().positive(),
	me: z.boolean(),
	url: z.string(),
	name: z.string(), // pleroma, resolved into id by parser
	accountIds: z.array(z.string()), // pleroma, resolved into accounts by parser
});

type PleromaReactionItemType = z.infer<typeof pleromaReactionItemSchema>;

const activityPubReactionItemSchema = z.object({
	id: z.string(),
	count: z.number().positive(),
	me: z.boolean(),
	accounts: z.array(z.string()),
	url: z.string().nullable().optional(),
	// name: z.string().optional(), // pleroma, resolved into id by parser
	// accountIds: z.array(z.string()), // pleroma, resolved into accounts by parser
});

type ActivityPubReactionItemType = z.infer<
	typeof activityPubReactionItemSchema
>;

const ActivityPubReactionStateSchema = z.array(activityPubReactionItemSchema);

type ActivityPubReactionStateType = z.infer<
	typeof ActivityPubReactionStateSchema
>;

class ActivityPubReactionsService {
	/**
	 * :blob: --> { id: blob }
	 * :blob@misskey.io: --> { id: blob, subdomain: misskey.io }
	 * @param input
	 * @param domain
	 * @param subdomain
	 */
	static extractReactionCode(input: string, domain: string, subdomain: string) {
		if (activitypubService.misskeyLike(domain)) {
			return { id: input };
		}
		if (MISSKEY_LOCAL_ALT_EX.test(input)) {
			const _name = MISSKEY_LOCAL_ALT_EX.exec(input)![1];
			return { id: _name };
		}
		if (MISSKEY_LOCAL_EX.test(input)) {
			const _name = MISSKEY_LOCAL_EX.exec(input)![1];
			return { id: _name };
		}
		return { id: input };
	}

	/**
	 * It is only possible to view remote reactions
	 */
	static cannotReact(id: string) {
		if (!id) return false;
		return (
			(MISSKEY_REMOTE_EX.test(id) || PLEROMA_REMOTE_EX.test(id)) &&
			!MISSKEY_LOCAL_ALT_EX.test(id)
		);
	}
	/**
	 * Local, Misskey --> :emoji@.:
	 * Remote, Misskey --> :emoji@subdomain:
	 * Local, Pleroma --> emoji
	 * Remote, Pleroma --> emoji@subdomain
	 *
	 * NOTE: Don't touch this. It just works !
	 */
	static renderData(
		input: ActivityPubReactionStateType,
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
			cache: CustomEmojiObject[];
			me: string;
		},
	) {
		let retval: DriverReactionResolvedType[] = [];

		for (const reaction of input) {
			let IS_ME = reaction.me;
			if (reaction.accounts && reaction.accounts.includes(me)) {
				IS_ME = true;
			}

			/**
			 *
			 */
			const IS_REMOTE =
				(MISSKEY_REMOTE_EX.test(reaction.id) ||
					PLEROMA_REMOTE_EX.test(reaction.id)) &&
				!MISSKEY_LOCAL_ALT_EX.test(reaction.id);

			const BASE = {
				name: reaction.id,
				count: reaction.count,
				interactable: !IS_REMOTE,
				me: IS_ME,
			};

			if (MISSKEY_LOCAL_ALT_EX.test(reaction.id)) {
				// [Misskey] [Local] emoji (search in cache)
				const _name = MISSKEY_LOCAL_ALT_EX.exec(reaction.id)![1];
				const match = cache.find(
					(o) => o.shortCode === _name || o.aliases.includes(_name),
				);
				if (!match) {
					console.log('[WARN]: local emoji not found for', _name);
					continue;
				}

				retval.push({
					...BASE,
					type: 'image',
					url: match.url,
				});
			} else if (MISSKEY_REMOTE_EX.test(reaction.id)) {
				// [Misskey] [Remote] reaction (search in payload)
				const _name = MISSKEY_LOCAL_EX.exec(reaction.id)![1];
				const match = calculated.find((o) => o.name === _name);

				if (!match) {
					console.log(
						'[WARN]: failed to resolve remote misskey reaction',
						reaction,
						calculated,
					);
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
				const _name = MISSKEY_LOCAL_EX.exec(reaction.id)![1];
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
		client: ApiTargetInterface,
		postId: string,
		reactionId: string,
		domain: string,
		setLoading: (val: boolean) => void,
	) {
		setLoading(true);
		if (ActivityPubService.pleromaLike(domain)) {
			const { data, error } = await (
				client as PleromaApiAdapter
			).statuses.removeReaction(postId, reactionId);
			if (error) {
				console.log('[WARN]: failed to add reaction', error);
				return null;
			}

			setLoading(false);
			return data.emojiReactions.map((o: PleromaReactionItemType) => ({
				id: o.name.length > 2 ? `:${o.name}:` : o.name,
				me: o.me,
				count: o.count,
				accounts: o.accountIds || [],
			}));
		} else if (ActivityPubService.misskeyLike(domain)) {
			const { error } = await (
				client as MisskeyApiAdapter
			).statuses.removeReaction(postId, reactionId);
			if (error && error.code) {
				console.log('[WARN]: failed to remove reaction', error);
				return null;
			}

			return ActivityPubReactionsService.syncMisskeyReactionState(
				client,
				postId,
				domain,
				setLoading,
			);
		}
		return null;
	}

	/**
	 * Refetch the Misskey status details
	 * and sync the users reaction
	 * status
	 * @param client
	 * @param postId
	 * @param domain
	 * @param setLoading
	 */
	private static async syncMisskeyReactionState(
		client: ApiTargetInterface,
		postId: string,
		domain: string,
		setLoading: (val: boolean) => void,
	): Promise<ActivityPubReactionStateType> {
		const currentPost = await (client as MisskeyApiAdapter).statuses.getPost(
			postId,
		);

		if (!currentPost) {
			setLoading(false);
			return [];
		}

		const status = PostParser.rawToInterface(currentPost, domain);
		setLoading(false);
		return status.getReactions(status.getMyReaction() || 'N/A');
	}

	/**
	 * Add a reaction
	 * @param client
	 * @param postId
	 * @param reactionId
	 * @param domain
	 * @param setLoading
	 */
	static async addReaction(
		client: ApiTargetInterface,
		postId: string,
		reactionId: string,
		domain: string,
		setLoading: Dispatch<SetStateAction<boolean>>,
	): Promise<ActivityPubReactionStateType> {
		setLoading(true);
		if (ActivityPubService.pleromaLike(domain)) {
			const { data, error } = await (
				client as PleromaApiAdapter
			).statuses.addReaction(postId, reactionId);

			if (error) {
				console.log('[WARN]: failed to add reaction', error);
				return [];
			}

			setLoading(false);
			return data.emojiReactions.map((o: PleromaReactionItemType) => ({
				id: o.name.length > 2 ? `:${o.name}:` : o.name,
				me: o.me,
				count: o.count,
				accounts: o.accountIds || [],
			}));
		} else if (ActivityPubService.misskeyLike(domain)) {
			if (!MISSKEY_LOCAL_EX.test(reactionId)) {
				reactionId = `:${reactionId}:`;
			}
			const { error } = await (
				client as MisskeyApiAdapter
			).statuses.addReaction(postId, reactionId);

			if (error) {
				console.log('[WARN]: failed to add reaction', error);
				return [];
			}

			return ActivityPubReactionsService.syncMisskeyReactionState(
				client,
				postId,
				domain,
				setLoading,
			);
		}
		return [];
	}
}

export { activityPubReactionItemSchema, ActivityPubReactionStateSchema };
export type { ActivityPubReactionStateType, ActivityPubReactionItemType };

export default ActivityPubReactionsService;
