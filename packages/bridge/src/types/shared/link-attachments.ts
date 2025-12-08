import z from 'zod';

const postLinkAttachmentObjectSchema = z.object({
	url: z.string(),
	title: z.string(),
	description: z.string(),
	bannerImageUrl: z.string().nullable(),
	bannerWidth: z.number().optional(),
	bannerHeight: z.number().optional(),
});

/**
 * To be used outside the package
 */
type PostLinkAttachmentObjectType = z.infer<
	typeof postLinkAttachmentObjectSchema
>;

const akkomaCardObjectSchema = z.object({
	type: z.literal('link'),
	url: z.string(),
	title: z.string().optional(),
	description: z.string().optional(),
	image: z.string().nullable(),
	pleroma: z.object({
		opengraph: z.object({
			site_name: z.string(), // different from title
			'image:height': z.coerce.number().optional(), // e.g. - "1080",
			'image:width': z.coerce.number().optional(),
			type: z.string().optional(),
		}),
	}),
});

type AkkomaCardObjectType = z.infer<typeof akkomaCardObjectSchema>;

const mastoApiCardObjectSchema = z.object({
	type: z.literal('link'),
	url: z.string(),
	title: z.string(),
	description: z.string(),
	language: z.string(),
	width: z.number(),
	height: z.number(),
	publishedAt: z.coerce.date(),
	blurhash: z.string(),
	image: z.string().nullable(),
	imageDescription: z.string(),
});

type MastoApiCardObjectType = z.infer<typeof mastoApiCardObjectSchema>;

export {
	postLinkAttachmentObjectSchema,
	akkomaCardObjectSchema,
	mastoApiCardObjectSchema,
};

export type {
	AkkomaCardObjectType,
	MastoApiCardObjectType,
	PostLinkAttachmentObjectType,
};
