import { PostObjectType } from '#/parsers/post.js';

function recursive(node: any): number {
	if (!node) return 0;

	if (Array.isArray(node)) {
		return node.reduce((sum, item) => sum + recursive(item), 0);
	}
	let count = 0;
	if (['para', 'bold', 'italic', 'inline'].includes(node.type)) {
		count += node.nodes.reduce(
			(sum: number, item: any) => sum + recursive(item),
			0,
		);
	} else if (node.type === 'customEmoji') {
		count += 1;
	}
	return count;
}

function _implementation(post: PostObjectType): PostObjectType {
	const source = post.content.parsed;
	console.log(post.id, recursive(source));
	return {
		...post,
		calculated: {
			...post.calculated,
			customEmojiCount: recursive(source),
		},
	};
}

/**
 * Count the number of custom emoji occurrences
 * in the post's ody content
 *
 * Useful for preventing performance issues
 * trying to render posts with a heavy number of
 * emojis
 *
 * here is a sample with 159 custom emojis
 * that crashes the app:
 * https://misskey.io/notes/a2aedxz78snw9j9g
 *
 * - populates the `calculated.customEmojiCount` field
 * @param input
 */
export function countEmojisInBodyContent(
	input: PostObjectType | PostObjectType[],
): PostObjectType | PostObjectType[] {
	if (Array.isArray(input)) return input.map(_implementation);
	return _implementation(input);
}
