import {
	ApiTargetInterface,
	type DhaagaPostThreadInterfaceType,
	PostObjectType,
} from '#/index.js';
import { PostParser } from '#/index.js';

/**
 * Flattens a context object to its reply chain
 * @param data the api response, as is
 *
 * NOTE: replies are only available top-down
 *
 * (just like mastodon)
 * @param client
 * @param anchor the post-object being viewed
 *
 * - anchor is the post-object that is being viewed
 * - history is the chain of posts that are above the anchor (in order)
 * - itemLookup is a map of post-id to a post-object
 * - childrenLookup is a map of post-id to an array of children post-ids
 * @returns { anchor: PostObjectType, history: PostObjectType[], itemLookup: Map<string, PostObjectType>, childrenLookup: Map<string, string[]> }
 */
export function postThreadInterfaceToObjectChain(
	data: DhaagaPostThreadInterfaceType,
	client: ApiTargetInterface,
	anchor: PostObjectType,
): {
	anchor: PostObjectType;
	history: PostObjectType[];
	itemLookup: Map<string, PostObjectType>;
	childrenLookup: Map<string, string[]>;
} {
	let parents = [];
	let currentHead = data.ancestors.find((o) => !o.post.isReply());

	while (currentHead && currentHead.id !== anchor.id) {
		parents.push(
			PostParser.interfaceToJson(currentHead.post, {
				driver: client.driver,
				server: client.server!,
			}),
		);
		currentHead = data.ancestors.find(
			(o) => o.post.getParentStatusId() === currentHead!.post.getId(),
		);
	}

	let lookup = new Map<string, PostObjectType>();
	let childrenMapper = new Map<string, string[]>();

	data.descendants.forEach((o) => {
		console.log(o.post.getId(), o.post.getParentStatusId(), anchor.id);
	});

	function findChildren(post: PostObjectType) {
		lookup.set(post.id, post);

		const children = data.descendants.filter(
			(o) => o.post.getParentStatusId() === post.id,
		);

		let validChildren: string[] = [];
		children.forEach((o) => {
			const parsed = PostParser.interfaceToJson(o.post, {
				driver: client.driver,
				server: client.server!,
			});
			if (!parsed) {
				console.log('[WARN]: failed to parse post');
			} else {
				findChildren(parsed);
				validChildren.push(parsed.id);
			}
		});
		childrenMapper.set(post.id, validChildren);
	}

	findChildren(anchor);

	return {
		history: parents.filter((o) => !!o),
		anchor,
		itemLookup: lookup,
		childrenLookup: childrenMapper,
	};
}
