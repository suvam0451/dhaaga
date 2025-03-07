import { AppBskyFeedGetPostThread } from '@atproto/api';
import { KNOWN_SOFTWARE, PostTargetInterface } from '@dhaaga/bridge';
import { PostParser } from '@dhaaga/bridge';
import { $Typed } from '@atproto/api/src/client/util';
import { ThreadViewPost } from '@atproto/api/dist/client/types/app/bsky/feed/defs';

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
		const thread = data?.data?.thread;

		// TODO: handle blocked/missing posts
		if (
			thread.$type === 'app.bsky.feed.defs#blockedPost' ||
			thread.$type === 'app.bsky.feed.defs#notFoundPost'
		) {
			return null;
		}

		const _thread = data?.data?.thread as $Typed<ThreadViewPost>;

		let lookup = new Map<string, PostTargetInterface>();
		let childrenMapper = new Map<string, PostTargetInterface[]>();

		let curr: PostTargetInterface = PostParser.rawToInterface<unknown>(
			_thread.post,
			KNOWN_SOFTWARE.BLUESKY,
		);
		lookup.set(curr.getId(), curr);

		// recurse parents
		let parent: any = _thread.parent;
		let child: PostTargetInterface = curr;
		while (!!parent) {
			const data = PostParser.rawToInterface<unknown>(
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
		let root: PostTargetInterface = child;

		function processList(replies: any[], parentId: string) {
			replies.forEach((o) => {
				const _o = PostParser.rawToInterface<unknown>(
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
