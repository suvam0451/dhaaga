import { AppPostObject } from '../types/app-post.types';
import { AppUserObject } from '../types/app-user.types';
import { AppNotificationObject } from '../types/app-notification.types';
import { DhaagaJsNotificationType } from '@dhaaga/shared-abstraction-activitypub';

/**
 * Convert DTO/Interface arrays
 * into categorically different
 * cell types
 */
class FlashListService {
	static posts(input: AppPostObject[]): FlashListType_Post[] {
		return input.map((o) => {
			const HAS_MEDIA = o.content.media.length > 0;
			const IS_SENSITIVE = o.meta.sensitive;

			if (HAS_MEDIA) {
				return {
					type: FLC_Post.WithMedia,
					props: {
						dto: o,
					},
				};
			}
			if (IS_SENSITIVE) {
				return {
					type: FLC_Post.WithMedia,
					props: {
						dto: o,
					},
				};
			}
			return {
				type: FLC_Post.TextOnly,
				props: {
					dto: o,
				},
			};
		});
	}

	static users(input: AppUserObject[]) {}

	static notifications(
		input: AppNotificationObject[],
	): FlashListType_Notification[] {
		if (!input || !Array.isArray(input)) return [];
		return input
			.map((o) => ({
				type: o.type as unknown as DhaagaJsNotificationType,
				props: {
					dto: o,
				},
			}))
			.filter((o) => !!o);
	}
}

enum FLC_Post {
	TextOnly,
	WithMedia,
	WithSpoiler,
}

interface FLC_Post_TextOnly {
	type: FLC_Post.TextOnly;
	props: {
		dto: AppPostObject;
	};
}

interface FLC_Post_WithMedia {
	type: FLC_Post.WithMedia;
	props: {
		dto: AppPostObject;
	};
}

interface FLC_Post_WithSpoiler {
	type: FLC_Post.WithSpoiler;
	props: {
		dto: AppPostObject;
	};
}

export type FlashListType_Post =
	| FLC_Post_TextOnly
	| FLC_Post_WithMedia
	| FLC_Post_WithSpoiler;

export type FlashListType_Notification = {
	type: DhaagaJsNotificationType;
	props: {
		dto: AppNotificationObject;
	};
};

export default FlashListService;
