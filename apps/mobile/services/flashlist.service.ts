import type {
	UserObjectType,
	NotificationObjectType,
	PostObjectType,
} from '@dhaaga/bridge';
import { DriverNotificationType } from '@dhaaga/bridge';
import {
	ProfilePinnedTag,
	ProfilePinnedTimeline,
	ProfilePinnedUser,
} from '@dhaaga/db';

/**
 * Convert DTO/Interface arrays
 * into categorically different
 * cell types
 */
class FlashListService {
	static posts(input: PostObjectType[]): FlashListType_Post[] {
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

	static users(input: UserObjectType[]) {}

	static pinnedTags(input: ProfilePinnedTag[]): FlashListType_PinnedTag[] {
		return [
			...input.map(
				(o) =>
					({
						type: 'entry',
						props: {
							dto: o,
						},
					}) as FlashListType_PinnedTag,
			),
		];
	}

	static pinnedTimelines(
		input: ProfilePinnedTimeline[],
	): FlashListType_PinnedTimeline[] {
		return [
			...input.map(
				(o) =>
					({
						type: 'entry',
						props: {
							dto: o,
						},
					}) as FlashListType_PinnedTimeline,
			),
			{
				type: 'eol',
			},
		];
	}

	static pinnedUsers(input: ProfilePinnedUser[]): FlashListType_PinnedUser[] {
		return [
			...input.map(
				(o) =>
					({
						type: 'entry',
						props: {
							dto: o,
						},
					}) as FlashListType_PinnedUser,
			),
			{
				type: 'eol',
			},
		];
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
		dto: PostObjectType;
	};
}

interface FLC_Post_WithMedia {
	type: FLC_Post.WithMedia;
	props: {
		dto: PostObjectType;
	};
}

interface FLC_Post_WithSpoiler {
	type: FLC_Post.WithSpoiler;
	props: {
		dto: PostObjectType;
	};
}

export type FlashListType_Post =
	| FLC_Post_TextOnly
	| FLC_Post_WithMedia
	| FLC_Post_WithSpoiler;

export type FlashListType_Notification = {
	type: DriverNotificationType;
	props: {
		dto: NotificationObjectType;
	};
};

export type FlashListType_PinnedTimeline =
	| {
			type: 'entry';
			props: {
				dto: ProfilePinnedTimeline;
			};
	  }
	| {
			type: 'eol';
	  };

export type FlashListType_PinnedTag =
	| {
			type: 'entry';
			props: {
				dto: ProfilePinnedTag;
			};
	  }
	| {
			type: 'eol';
	  };

export type FlashListType_PinnedUser =
	| {
			type: 'entry';
			props: {
				dto: ProfilePinnedUser;
			};
	  }
	| {
			type: 'eol';
	  };

export default FlashListService;
