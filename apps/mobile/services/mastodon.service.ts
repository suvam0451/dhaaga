import { StatusInterface } from '@dhaaga/shared-abstraction-activitypub';

class MastodonService {
	/**
	 * Flattens a context object to its reply chain
	 * @param target the selected post
	 * @param contextChain
	 */
	static solveContext(
		target: StatusInterface,
		contextChain: StatusInterface[],
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
		let flat = contextChain;

		flat.push(target);

		// store all lookups
		flat.forEach((o) => {
			lookup.set(o.getId(), o);
		});

		// try to fix the root
		let root = flat.find((o) => o?.getParentStatusId() === null);
		if (!root) root = target;
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
