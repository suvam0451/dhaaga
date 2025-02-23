import {
	DriverPostLikeState,
	DriverService,
	KNOWN_SOFTWARE,
	Result,
} from '@dhaaga/bridge';
import ActivityPubService from '../activitypub.service';
import type { PostObjectType } from '@dhaaga/bridge';
import { PostInspector, ApiTargetInterface } from '@dhaaga/bridge';
import { produce } from 'immer';
import ActivityPubReactionsService from '../approto/activitypub-reactions.service';
import { AtprotoPostService } from '../atproto.service';

export class PostMutator {
	private readonly driver: KNOWN_SOFTWARE;
	private readonly client: ApiTargetInterface;

	constructor(driver: KNOWN_SOFTWARE, client: ApiTargetInterface) {
		this.driver = driver;
		this.client = client;
	}

	async toggleLike(input: PostObjectType): Promise<PostObjectType> {
		const target = PostInspector.getContentTarget(input);

		let nextState: Result<DriverPostLikeState, string>;

		try {
			if (DriverService.supportsAtProto(this.driver)) {
				nextState = await AtprotoPostService.toggleLike(
					this.client,
					target.meta.uri,
					target.meta.cid,
					target.atProto?.viewer,
				);
			} else if (!DriverService.supportsMisskeyApi(this.driver)) {
				nextState = await ActivityPubService.toggleLike(
					this.client,
					target.interaction.liked,
					target.id,
				);
			}

			if (nextState.isErr()) {
				console.log('[WARN]: failed to toggle like', nextState.error);
				return input;
			}

			const _state = nextState.unwrap();
			if (input.id === target.id) {
				return produce(input, (draft) => {
					draft.interaction.liked = _state.state;
					draft.stats.likeCount += _state.state ? 1 : -1;
					if (draft.atProto.viewer) draft.atProto.viewer.like = _state.uri;
				});
			} else if (input.boostedFrom?.id === target.id) {
				return produce(input, (draft) => {
					draft.boostedFrom.interaction.liked = _state.state;
					draft.boostedFrom.stats.likeCount += _state.state ? 1 : -1;
					if (draft.atProto.viewer)
						draft.boostedFrom.atProto.viewer.like = _state.uri;
				});
			}
		} catch (e) {
			console.log('[WARN]: failed to toggle like', e);
			return input;
		}
	}

	async toggleBookmark(input: PostObjectType): Promise<PostObjectType> {
		const target = PostInspector.getContentTarget(input);

		try {
			const res = await ActivityPubService.toggleBookmark(
				this.client,
				target.id,
				target.interaction.bookmarked,
			);
			if (input.id === target.id) {
				return produce(input, (draft) => {
					draft.interaction.bookmarked = res;
					draft.state.isBookmarkStateFinal = true;
				});
			} else if (input.boostedFrom?.id === target.id) {
				return produce(input, (draft) => {
					draft.boostedFrom.interaction.bookmarked = res;
					draft.boostedFrom.state.isBookmarkStateFinal = true;
				});
			}
		} catch (e) {
			console.log('[WARN]: failed to toggle bookmark', e);
		}
		return input;
	}

	async finalizeBookmarkState(input: PostObjectType): Promise<PostObjectType> {
		const target = PostInspector.getContentTarget(input);

		try {
			const res = await ActivityPubService.getBookmarkState(
				this.client,
				target.id,
			);
			if (res === null) return;

			if (input.id === target.id) {
				return produce(input, (draft) => {
					draft.interaction.bookmarked = res;
					draft.state.isBookmarkStateFinal = true;
				});
			} else if (input.boostedFrom?.id === target.id) {
				return produce(input, (draft) => {
					draft.boostedFrom.interaction.bookmarked = res;
					draft.boostedFrom.state.isBookmarkStateFinal = true;
				});
			}
		} catch (e) {
			console.log('[WARN]: failed to finalize bookmark state', e);
		}
		return input;
	}

	async toggleShare(input: PostObjectType): Promise<PostObjectType> {
		const target = PostInspector.getContentTarget(input);

		if (this.driver === KNOWN_SOFTWARE.BLUESKY) {
			const result = await AtprotoPostService.toggleRepost(
				this.client,
				target.meta.uri,
				target.meta.cid,
				target.atProto?.viewer,
			);
			if (!result.success) return input;

			if (input.id === target.id) {
				return produce(input, (draft) => {
					draft.interaction.boosted = result.state;
					draft.stats.boostCount += result.state ? 1 : -1;
					draft.atProto.viewer.repost = result.uri;
				});
			} else if (input.boostedFrom?.id === target.id) {
				return produce(input, (draft) => {
					draft.boostedFrom.interaction.boosted = result.state;
					draft.boostedFrom.stats.boostCount += result.state ? 1 : -1;
					draft.boostedFrom.atProto.viewer.repost = result.uri;
				});
			}
		}

		try {
			const res = await ActivityPubService.toggleBoost(
				this.client,
				target.id,
				target.interaction.boosted,
				this.driver,
			);

			if (input.id === target.id) {
				return produce(input, (draft) => {
					draft.interaction.boosted = res !== -1;
					draft.stats.boostCount += res;
				});
			} else if (input.boostedFrom?.id === target.id) {
				return produce(input, (draft) => {
					draft.boostedFrom.interaction.boosted = res != -1;
					draft.boostedFrom.stats.boostCount += res;
				});
			}
		} catch (e) {
			console.log('[WARN]: failed to toggle share', e);
		}
		return input;
	}

	private applyReactionData(input: PostObjectType, _data: any) {
		const target = PostInspector.getContentTarget(input);
		return produce(input, (draft) => {
			if (draft.id === target.id) draft.stats.reactions = _data;
			if (draft.boostedFrom?.id === target.id)
				draft.boostedFrom.stats.reactions = _data;
		});
	}

	async addReaction(
		input: PostObjectType,
		reactionCode: string,
	): Promise<PostObjectType> {
		const target = PostInspector.getContentTarget(input);
		try {
			/**
			 * Response looks like this
			 *
			 * [{"accounts": [], "count": 1, "id": ":ablobbongo_lr@.:", "me": true, "url": null}]
			 */
			const nextState = await ActivityPubReactionsService.addReaction(
				this.client,
				target.id,
				reactionCode,
				this.driver,
				() => {},
			);
			return this.applyReactionData(input, nextState);
		} catch (e) {
			return input;
		}
	}

	async removeReaction(
		input: PostObjectType,
		reactionCode: string,
	): Promise<PostObjectType> {
		const target = PostInspector.getContentTarget(input);
		try {
			/**
			 * Response looks like this
			 *
			 * [{"accounts": [], "count": 1, "id": ":ablobbongo_lr@.:", "me": true, "url": null}]
			 */
			const nextState = await ActivityPubReactionsService.removeReaction(
				this.client,
				target.id,
				reactionCode,
				this.driver,
				(ok: boolean) => {},
			);
			return this.applyReactionData(input, nextState);
		} catch (e) {
			return input;
		}
	}
}
