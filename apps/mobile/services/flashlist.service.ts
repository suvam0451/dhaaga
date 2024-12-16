import { ActivityPubStatusAppDtoType } from './approto/app-status-dto.service';

/**
 * Convert DTO/Interface arrays
 * into categorically different
 * cell types
 */
class FlashListService {
	static posts(input: ActivityPubStatusAppDtoType[]): FlashListType_Post[] {
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

	static users(input: ActivityPubAppUserDtoType[]) {}
}

enum FLC_Post {
	TextOnly,
	WithMedia,
	WithSpoiler,
}

interface FLC_Post_TextOnly {
	type: FLC_Post.TextOnly;
	props: {
		dto: ActivityPubStatusAppDtoType;
	};
}

interface FLC_Post_WithMedia {
	type: FLC_Post.WithMedia;
	props: {
		dto: ActivityPubStatusAppDtoType;
	};
}

interface FLC_Post_WithSpoiler {
	type: FLC_Post.WithSpoiler;
	props: {
		dto: ActivityPubStatusAppDtoType;
	};
}

export type FlashListType_Post =
	| FLC_Post_TextOnly
	| FLC_Post_WithMedia
	| FLC_Post_WithSpoiler;

export default FlashListService;
