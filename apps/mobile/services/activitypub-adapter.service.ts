import {
	ActivitypubStatusAdapter,
	ActivityPubUserAdapter,
	StatusInterface,
} from '@dhaaga/shared-abstraction-activitypub';

/**
 * Wrapper service to invoke provider functions
 */
class ActivityPubAdapterService {
	static adaptStatus(item: any, domain: string): StatusInterface {
		return ActivitypubStatusAdapter(item, domain);
	}

	static adaptManyStatuses(items: any[], domain: string): StatusInterface[] {
		return items
			.filter((o) => !!o)
			.map((o) => ActivitypubStatusAdapter(o, domain));
	}

	static adaptContextChain(
		apiResponse: any,
		domain: string,
	): StatusInterface[] {
		const ancestors = this.adaptManyStatuses(apiResponse.ancestors, domain);
		const descendants = this.adaptManyStatuses(apiResponse.descendants, domain);
		return [...ancestors, ...descendants];
	}

	static adaptUser(o: any, domain: string) {
		return ActivityPubUserAdapter(o, domain);
	}
}

export default ActivityPubAdapterService;
