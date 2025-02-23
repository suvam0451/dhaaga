import { PostInspector, PostObjectType } from '../../../../parsers/post.js';
import { ApiTargetInterface } from './_index.js';
import { DriverService } from '../../../../services/driver.js';
import { AtprotoApiAdapter, DriverPostLikeState, Result } from '@dhaaga/bridge';
import { Err, Ok } from '../../../../utils/index.js';
import { ApiAsyncResult } from '../../../../utils/api-result.js';
import { ApiErrorCode } from '../../../../types/result.types.js';

class Mutator {
	client: ApiTargetInterface;

	constructor(client: ApiTargetInterface) {
		this.client = client;
	}

	/**
	 * Toggles like for this post object and
	 * return it with mutations, if successful
	 * @param {PostObjectType} input post object
	 * @returns {PostObjectType} wrapped as result
	 */
	async toggleLike(input: PostObjectType): ApiAsyncResult<PostObjectType> {
		const target = PostInspector.getContentTarget(input);
		let nextState: Result<DriverPostLikeState, string> | undefined;

		try {
			if (DriverService.supportsAtProto(this.client.driver)) {
				const _api = this.client as AtprotoApiAdapter;
				nextState = target.atProto?.viewer?.like
					? await _api.statuses.atProtoDeleteLike(target.atProto?.viewer?.like)
					: await _api.statuses.atProtoLike(target.meta.uri!, target.meta.cid!);
			} else if (!DriverService.supportsMisskeyApi(this.client.driver)) {
				nextState = target.interaction.liked
					? await this.client.statuses.removeLike(target.id)
					: await this.client.statuses.like(target.id);
			}

			if (nextState === undefined)
				return Err(ApiErrorCode.OPERATION_UNSUPPORTED);

			if (nextState.isErr()) {
				console.log('[WARN]: failed to toggle like', nextState.error);
				return Err(nextState.error);
			}

			const _state = nextState.unwrap();
			const draft: PostObjectType = JSON.parse(JSON.stringify(input));

			if (draft.id === target.id) {
				draft.interaction.liked = _state.state;
				draft.stats.likeCount += _state.state ? 1 : -1;
				if (draft.atProto && draft.atProto.viewer)
					draft.atProto.viewer.like = _state.uri;
			} else if (draft.boostedFrom && draft.boostedFrom.id === target.id) {
				draft.boostedFrom.interaction.liked = _state.state;
				draft.boostedFrom.stats.likeCount += _state.state ? 1 : -1;
				if (draft.boostedFrom.atProto && draft.boostedFrom.atProto.viewer)
					draft.boostedFrom.atProto.viewer.like = _state.uri;
			}
			return Ok(draft);
		} catch (e) {
			console.log('[WARN]: failed to toggle like', e);
			return Err(ApiErrorCode.UNKNOWN_ERROR);
		}
	}

	async toggleShare(input: PostObjectType) {
		return input;
	}

	async loadBookmark(input: PostObjectType) {
		return input;
	}

	/**
	 * Toggles bookmark for this post object and
	 * return it with mutations, if successful
	 * @param {PostObjectType} input post object
	 * @returns {PostObjectType} wrapped as result
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
