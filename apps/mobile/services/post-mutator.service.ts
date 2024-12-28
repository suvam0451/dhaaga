import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';
import ActivityPubClient from '@dhaaga/shared-abstraction-activitypub/dist/adapters/_client/_interface';
import { PostMiddleware } from './middlewares/post.middleware';
import ActivityPubService from './activitypub.service';
import { AppPostObject } from '../types/app-post.types';
import { produce } from 'immer';

export class PostMutatorService {
	private readonly driver: KNOWN_SOFTWARE;
	private readonly client: ActivityPubClient;

	constructor(driver: KNOWN_SOFTWARE, client: ActivityPubClient) {
		this.driver = driver;
		this.client = client;
	}

	async toggleLike(input: AppPostObject): Promise<AppPostObject> {
		const target = PostMiddleware.getContentTarget(input);
		try {
			const res = await ActivityPubService.toggleLike(
				this.client,
				target.id,
				target.interaction.liked,
				this.driver,
			);
			if (input.id === target.id) {
				return produce(input, (draft) => {
					draft.interaction.liked = res !== -1;
					draft.stats.likeCount += res;
				});
			} else if (input.boostedFrom?.id === target.id) {
				return produce(input, (draft) => {
					draft.boostedFrom.interaction.liked = res != -1;
					draft.boostedFrom.stats.likeCount += res;
				});
			}
		} catch (e) {
			console.log('[WARN]: failed to toggle like', e);
		}
	}

	async toggleBookmark(input: AppPostObject): Promise<AppPostObject> {
		const target = PostMiddleware.getContentTarget(input);

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

	async finalizeBookmarkState(input: AppPostObject): Promise<AppPostObject> {
		const target = PostMiddleware.getContentTarget(input);

		try {
			const res = await ActivityPubService.getBookmarkState(
				this.client,
				target.id,
			);
			if (res === null) return;

			if (input.id === target.id) {
				input.interaction.bookmarked = res;
				input.state.isBookmarkStateFinal = true;
			} else if (input.boostedFrom?.id === target.id) {
				input.boostedFrom.interaction.bookmarked = res;
				input.boostedFrom.state.isBookmarkStateFinal = true;
			}
		} catch (e) {
			console.log('[WARN]: failed to finalize bookmark state', e);
		}
		return input;
	}

	async toggleShare(input: AppPostObject): Promise<AppPostObject> {
		const target = PostMiddleware.getContentTarget(input);
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
}
