import { z } from 'zod';

/**
 * This object from profile
 * can be used to estimate user relations
 */
type AtprotoProfileViewerDto = {
	muted?: boolean;
	blockedBy?: boolean;
	/**
	 * at://did:plc:<>/app.bsky.graph.follow/<>
	 *
	 * generally, existence means following
	 * */
	following?: string;
	knownFollowers?: {
		count: number;
		followers: {
			// not used by Dhaaga
			associated: {
				chat: {
					allowIncoming: string;
				};
			};
			did: string;
			handle: string;
			displayName: string;
			labels: any[];
			viewer: {
				blockedBy?: boolean;
				following?: string;
				muted?: boolean;
			};
		};
	};
};

const FACET_TYPE = ['app.bsky.richtext.facet'] as const;
const FACET_ENUM = z.enum(FACET_TYPE);

export const FACET_ITEM_TYPE = [
	'app.bsky.richtext.facet#mention',
	'app.bsky.richtext.facet#link',
	'app.bsky.richtext.facet#tag',
] as const;
const FACET_ITEM_ENUM = z.enum(FACET_ITEM_TYPE);

const AtprotoFacetDto = z.object({
	$type: FACET_ENUM.optional(),
	index: z.object({
		byteStart: z.number().int(),
		byteEnd: z.number().int(),
	}),
	features: z.array(
		z.object({
			$type: FACET_ITEM_ENUM,
			did: z.string().optional(),
			uri: z.string().optional(),
			tag: z.string().optional(),
		}),
	),
});

export type AtprotoFacetType = z.infer<typeof AtprotoFacetDto>;
