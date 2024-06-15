import { mastodon } from '@dhaaga/shared-provider-mastodon/src';
import { StatusInterface } from '@dhaaga/shared-abstraction-activitypub/src';
import ActivityPubAdapterService from './activitypub-adapter.service';

class MastodonService {
	/**
	 * Flattens a context object to its reply chain
	 * @param current the current status in focus
	 * @param data
	 * @param domain
	 */
	static solveContext(
		current: StatusInterface,
		data: mastodon.v1.Context,
		domain: string,
	) {
		let deque: string[] = [];
		let lookup = new Map<string, StatusInterface>();
		let childrenMapper = new Map<string, StatusInterface[]>();

		/**
		 *  flatten the chain
		 *
		 *  NOTE: In the future (and also for public timelines),
		 *  this may not be performant nad/or complete
		 */
		let flat = ActivityPubAdapterService.adaptContextChain(data, domain);

		// store all lookups
		lookup.set(current?.getId(), current);
		flat.forEach((o) => {
			lookup.set(o.getId(), o);
		});

		// try to fix the root
		let root = flat.find((o) => o?.getParentStatusId() === null);
		if (!root) root = current;
		deque.push(root.getId());

		while (deque.length > 0 && flat.length > 0) {
			const top = deque.shift();
			const topI = lookup.get(top);

			// save list of children
			const matches = flat.filter(
				(o) => o.getParentStatusId() === topI.getId(),
			);
			childrenMapper.set(topI.getId(), matches);

			// dfs
			matches.forEach((o) => {
				deque.push(o.getId());
			});

			// reduce list
			flat = flat.filter(
				(o) => o.getParentStatusId() !== lookup.get(top).getId(),
			);
		}

		return {
			root,
			itemLookup: lookup,
			childrenLookup: childrenMapper,
		};
	}
}

export default MastodonService;
