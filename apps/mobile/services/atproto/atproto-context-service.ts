import { AppBskyFeedGetPostThread } from '@atproto/api';
import {
	KNOWN_SOFTWARE,
	StatusInterface,
} from '@dhaaga/shared-abstraction-activitypub';
import ActivityPubAdapterService from '../activitypub-adapter.service';

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

		let curr: StatusInterface = ActivityPubAdapterService.adaptStatus(
			_thread.post,
			KNOWN_SOFTWARE.BLUESKY,
		);
		lookup.set(curr.getId(), curr);

		// recurse parents
		let parent: any = _thread.parent;
		let child: StatusInterface = curr;
		while (!!parent) {
			const data = ActivityPubAdapterService.adaptStatus(
				parent.post,
				KNOWN_SOFTWARE.BLUESKY,
			);
			lookup.set(data.getId(), data);

			if (childrenMapper.has(data.getId())) {
				childrenMapper.get(data.getId()).push(child);
			} else {
				childrenMapper.set(data.getId(), [child]);
			}

			parent = data.getParentRaw();
			child = data;
		}
		// the topmost child is the root
		let root: StatusInterface = child;

		return {
			root,
			target: curr,
			itemLookup: lookup,
			childrenLookup: childrenMapper,
		};
	}
}

export default AtprotoContextService;
