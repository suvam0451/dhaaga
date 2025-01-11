import { AppBskyFeedGetPostThread } from '@atproto/api';
import { KNOWN_SOFTWARE, StatusInterface } from '@dhaaga/bridge';
import { PostMiddleware } from '../middlewares/post.middleware';

class AtprotoContextService {
	/**
	 * Flattens a context object to its reply chain
	 * @param data the api response, as is
	 *
	 * NOTE: replies are only available top-down
	 *
	 * (just like mastodon)
	 */
	static solve(data: AppBskyFeedGetPostThread.Response) {
		const _thread = data?.data?.thread;

		let lookup = new Map<string, StatusInterface>();
		let childrenMapper = new Map<string, StatusInterface[]>();

		let curr: StatusInterface = PostMiddleware.rawToInterface<unknown>(
			_thread.post,
			KNOWN_SOFTWARE.BLUESKY,
		);
		lookup.set(curr.getId(), curr);

		// recurse parents
		let parent: any = _thread.parent;
		let child: StatusInterface = curr;
		while (!!parent) {
			const data = PostMiddleware.rawToInterface<unknown>(
				parent,
				KNOWN_SOFTWARE.BLUESKY,
			);
			lookup.set(data.getId(), data);

			if (childrenMapper.has(data.getId())) {
				childrenMapper.get(data.getId()).push(child);
			} else {
				childrenMapper.set(data.getId(), [child]);
			}

			parent = parent?.parent;
			child = data;
		}
		// the topmost child is the root
		let root: StatusInterface = child;

		function processList(replies: any[], parentId: string) {
			replies.forEach((o) => {
				const _o = PostMiddleware.rawToInterface<unknown>(
					o,
					KNOWN_SOFTWARE.BLUESKY,
				);
				lookup.set(_o.getId(), _o);

				if (childrenMapper.has(parentId)) {
					childrenMapper.get(parentId).push(_o);
				} else {
					childrenMapper.set(parentId, [_o]);
				}
				processList(o?.replies || [], _o.getId());
			});
		}

		processList(_thread.replies as any[], curr.getId());

		return {
			root,
			target: curr,
			itemLookup: lookup,
			childrenLookup: childrenMapper,
		};
	}
}

export default AtprotoContextService;
