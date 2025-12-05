import { PostInspector, PostObjectType } from '#/parsers/post.js';
import { ApiTargetInterface } from './_index.js';
import { DriverService } from '#/services/driver.js';
import { Err, Ok } from '#/utils/index.js';
import { ApiAsyncResult } from '#/utils/api-result.js';
import { ApiErrorCode } from '#/types/result.types.js';
import ActivityPubService from '#/services/activitypub.service.js';
import { KNOWN_SOFTWARE } from '#/data/driver.js';
import { AtprotoPostService } from '#/services/atproto.service.js';
import ActivityPubReactionsService from '#/services/activitypub-reactions.service.js';
import { DriverPostLikeState } from '#/types/driver.types.js';
import { AtprotoApiAdapter } from '../../bluesky/_router.js';
import { getHumanReadableError } from '#/utils/errors.utils.js';

class Mutator {
	client: ApiTargetInterface;

	constructor(client: ApiTargetInterface) {
		this.client = client;
	}

	private _applyReactionData(input: PostObjectType, _data: any) {
		const target = PostInspector.getContentTarget(input);
		const draft: PostObjectType = JSON.parse(JSON.stringify(input));

		if (draft.id === target.id) draft.stats.reactions = _data;
		if (draft.boostedFrom && draft.boostedFrom.id === target.id)
			draft.boostedFrom.stats.reactions = _data;

		return draft;
	}

	async addReaction(
		input: PostObjectType,
		reactionCode: string,
	): ApiAsyncResult<PostObjectType> {
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
				this.client.driver,
				() => {},
			);
			return Ok(this._applyReactionData(input, nextState));
		} catch (e) {
			return Err(ApiErrorCode.UNKNOWN_ERROR);
		}
	}

	async removeReaction(
		input: PostObjectType,
		reactionCode: string,
	): ApiAsyncResult<PostObjectType> {
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
				this.client.driver,
				(ok: boolean) => {},
			);
			return Ok(this._applyReactionData(input, nextState));
		} catch (e) {
			return Err(ApiErrorCode.UNKNOWN_ERROR);
		}
	}

	/**
	 * Toggles like for this post object and
	 * return it with mutations, if successful
	 * @param {PostObjectType} input post object
	 * @returns {PostObjectType} wrapped as result
	 */
	async toggleLike(input: PostObjectType): Promise<PostObjectType> {
		const target = PostInspector.getContentTarget(input);
		let nextState: DriverPostLikeState | undefined;

		if (DriverService.supportsAtProto(this.client.driver)) {
			const _api = this.client as unknown as AtprotoApiAdapter;
			nextState = target.atProto?.viewer?.like
				? await _api.statuses.atProtoDeleteLike(target.atProto?.viewer?.like)
				: await _api.statuses.atProtoLike(target.meta.uri!, target.meta.cid!);
		} else if (!DriverService.supportsMisskeyApi(this.client.driver)) {
			nextState = target.interaction.liked
				? await this.client.statuses.removeLike(target.id)
				: await this.client.statuses.like(target.id);
		}

		if (nextState === undefined)
			throw new Error(getHumanReadableError('operation not supported'));

		const draft: PostObjectType = JSON.parse(JSON.stringify(input));

		if (draft.id === target.id) {
			draft.interaction.liked = nextState.state;
			draft.stats.likeCount += nextState.state ? 1 : -1;
			if (draft.atProto && draft.atProto.viewer)
				draft.atProto.viewer.like = nextState.uri;
		} else if (draft.boostedFrom && draft.boostedFrom.id === target.id) {
			draft.boostedFrom.interaction.liked = nextState.state;
			draft.boostedFrom.stats.likeCount += nextState.state ? 1 : -1;
			if (draft.boostedFrom.atProto && draft.boostedFrom.atProto.viewer)
				draft.boostedFrom.atProto.viewer.like = nextState.uri;
		}
		return draft;
	}

	/**
	 * Toggles share for this post object and
	 * return it with mutations, if successful
	 * @param {PostObjectType} input post object
	 * @returns {PostObjectType} wrapped as result
	 */
	async toggleShare(input: PostObjectType): Promise<PostObjectType> {
		const target = PostInspector.getContentTarget(input);

		if (DriverService.supportsAtProto(this.client.driver)) {
			if (!target.atProto) return input;
			const result = await AtprotoPostService.toggleRepost(
				this.client,
				target.meta.uri!,
				target.meta.cid!,
				target.atProto.viewer?.repost,
			);
			if (!result.success) return input;

			const draft: PostObjectType = JSON.parse(JSON.stringify(input));

			if (draft.id === target.id) {
				draft.interaction.boosted = result.state!;
				draft.stats.boostCount += result.state ? 1 : -1;
				if (draft.atProto && draft.atProto.viewer)
					draft.atProto.viewer.repost = result.uri;
			} else if (draft.boostedFrom && draft.boostedFrom?.id === target.id) {
				draft.boostedFrom.interaction.boosted = result.state!;
				draft.boostedFrom.stats.boostCount += result.state ? 1 : -1;
				if (draft.boostedFrom.atProto && draft.boostedFrom.atProto.viewer)
					draft.boostedFrom.atProto.viewer.repost = result.uri;
			}

			return draft;
		} else {
			const res = await ActivityPubService.toggleBoost(
				this.client,
				target.id,
				target.interaction.boosted,
				this.client.driver as KNOWN_SOFTWARE,
			);
			const draft: PostObjectType = JSON.parse(JSON.stringify(input));

			if (draft.id === target.id) {
				draft.interaction.boosted = res !== -1;
				draft.stats.boostCount += res === null ? 0 : res;
			} else if (draft.boostedFrom && draft.boostedFrom?.id === target.id) {
				draft.boostedFrom.interaction.boosted = res != -1;
				draft.boostedFrom.stats.boostCount += res === null ? 0 : res;
			}
			return draft;
		}
	}

	/**
	 * Loads the bookmark state for misskey servers
	 * where it needs to be lazy loaded
	 * @param {PostObjectType} input post object
	 * @returns {PostObjectType} wrapped as result
	 */
	async loadBookmarkState(input: PostObjectType): Promise<PostObjectType> {
		const target = PostInspector.getContentTarget(input);
		if (target.state.isBookmarkStateFinal) return input;

		try {
			const res = await ActivityPubService.getBookmarkState(
				this.client,
				target.id,
			);
			if (res === null) return input;

			const draft: PostObjectType = JSON.parse(JSON.stringify(input));

			if (draft.id === target.id) {
				draft.interaction.bookmarked = res;
				draft.state.isBookmarkStateFinal = true;
			} else if (draft.boostedFrom && draft.boostedFrom.id === target.id) {
				draft.boostedFrom.interaction.bookmarked = res;
				draft.boostedFrom.state.isBookmarkStateFinal = true;
			}
			return draft;
		} catch (e) {
			console.log('[WARN]: failed to finalize bookmark state', e);
			return input;
		}
	}

	/**
	 * Toggles bookmark for this post-object and
	 * return it with mutations, if successful
	 * @param {PostObjectType} input post object
	 * @returns {PostObjectType} wrapped as a result
	 */
	async toggleBookmark(input: PostObjectType): ApiAsyncResult<PostObjectType> {
		if (!DriverService.canBookmark(this.client.driver))
			return Err(ApiErrorCode.OPERATION_UNSUPPORTED);

		const target = PostInspector.getContentTarget(input);

		try {
			const result = target.interaction.bookmarked
				? await this.client.statuses.unBookmark(target.id)
				: await this.client.statuses.bookmark(target.id);

			if (result.isErr()) return Err(ApiErrorCode.UNKNOWN_ERROR);

			const _state = result.unwrap();
			const draft: PostObjectType = JSON.parse(JSON.stringify(input));

			if (draft.id === target.id) {
				draft.interaction.bookmarked = _state.state;
				draft.state.isBookmarkStateFinal = true;
			} else if (draft.boostedFrom && draft.boostedFrom.id === target.id) {
				draft.boostedFrom.interaction.bookmarked = _state.state;
				draft.boostedFrom.state.isBookmarkStateFinal = true;
			}
			return Ok(draft);
		} catch (e) {
			return Err(ApiErrorCode.UNKNOWN_ERROR);
		}
	}
}

export { Mutator as PostMutatorRoute };
