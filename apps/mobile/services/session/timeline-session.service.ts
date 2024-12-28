import {
	ActivityPubClient,
	KNOWN_SOFTWARE,
} from '@dhaaga/shared-abstraction-activitypub';
import {
	AppTimelineReducerActionType,
	AppTimelineReducerDispatchType,
	AppTimelineReducerStateType,
} from '../../states/reducers/timeline.reducer';
import { Result } from '../../utils/result';
import ActivityPubService from '../activitypub.service';

export class TimelineSessionService {
	isValid: boolean;
	driver: KNOWN_SOFTWARE;
	client: ActivityPubClient;
	dispatch: AppTimelineReducerDispatchType;

	constructor(
		driver: KNOWN_SOFTWARE,
		client: ActivityPubClient,
		dispatch: AppTimelineReducerDispatchType,
	) {
		this.isValid = !!driver && !!client && !!dispatch;
		this.driver = driver;
		this.client = client;
		this.dispatch = dispatch;
	}

	/**
	 * Find matching post object
	 * @param State copy of timeline state
	 * @param key id of status
	 */
	findById(State: AppTimelineReducerStateType, key: string) {
		let match = State.items.find((o) => o.id === key);
		if (!match) match = State.items.find((o) => o.boostedFrom?.id === key);
		return !!match.boostedFrom ? match.boostedFrom : match;
	}

	async toggleLike(
		draft: AppTimelineReducerStateType,
		key: string,
	): Promise<Result<undefined>> {
		const match = this.findById(draft, key);
		if (!match) return { type: 'error', error: new Error('E_Not_Found') };

		try {
			const response = await ActivityPubService.toggleLike(
				this.client,
				key,
				match.interaction.liked,
				this.driver,
			);
			if (response !== null) {
				this.dispatch({
					type: AppTimelineReducerActionType.UPDATE_LIKE_STATUS,
					payload: {
						id: key,
						delta: response,
					},
				});
			}
			return { type: 'success' };
		} catch (e) {
			console.log('[WARN] could not toggle like', e);
			return { type: 'error', error: new Error(e) };
		}
	}

	/**
	 * Loads bookmark status for posts
	 */
	async loadBookmarkState(State: AppTimelineReducerStateType, key: string) {
		if (
			!this.client ||
			[
				KNOWN_SOFTWARE.MASTODON,
				KNOWN_SOFTWARE.PLEROMA,
				KNOWN_SOFTWARE.AKKOMA,
			].includes(this.driver)
		) {
			return;
		}
		const match = this.findById(State, key);
		if (!match) {
			console.log('[WARN]: target post not found in timeline data');
			return;
		}
		try {
			const res = await ActivityPubService.getBookmarkState(this.client, key);
			if (res === null) {
				return;
			}
			this.dispatch({
				type: AppTimelineReducerActionType.UPDATE_BOOKMARK_STATUS,
				payload: {
					id: key,
					value: res,
				},
			});
		} catch (e) {
			console.log('[WARN]: failed to get bookmark status', e);
		}
	}

	async toggleBookmark(State: AppTimelineReducerStateType, key: string) {
		const match = this.findById(State, key);
		if (!match) return { type: 'error', error: new Error('E_Not_Found') };

		ActivityPubService.toggleBookmark(
			this.client,
			key,
			match.interaction.bookmarked,
		)
			.then((res) => {
				console.log('bookmark action result', res);
				this.dispatch({
					type: AppTimelineReducerActionType.UPDATE_BOOKMARK_STATUS,
					payload: {
						id: key,
						value: res,
					},
				});
				return { type: 'success' };
			})
			.catch((e) => {
				console.log('[WARN]: could not toggle bookmark', e);
				return { type: 'error', error: new Error(e) };
			});
	}

	async finalizeBookmarkState(State: AppTimelineReducerStateType, key: string) {
		const match = this.findById(State, key);
		if (!match) return { type: 'error', error: new Error('E_Not_Found') };

		// bookmark resolution not needed for non-misskey instances
		if (match.state.isBookmarkStateFinal) return { type: 'success' };

		const res = await ActivityPubService.getBookmarkState(this.client, key);
		if (res === null) return;

		this.dispatch({
			type: AppTimelineReducerActionType.UPDATE_BOOKMARK_STATUS,
			payload: {
				id: key,
				value: res,
			},
		});
	}
}
