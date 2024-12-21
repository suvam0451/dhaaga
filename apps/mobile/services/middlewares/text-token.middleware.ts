export type AppTextToken = {};

export type AppParsedText = {
	nodes: AppTextToken[];
};

/**
 * deserializes a status string into app
 * compatible list of tokens
 *
 * We mostly use mfm, but sometimes do
 * custom text parsing
 */
export class TextTokenMiddleware {}
