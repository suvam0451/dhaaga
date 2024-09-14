import {
	ActivitypubStatusAdapter,
	ActivityPubUserAdapter,
	StatusInterface,
	UserInterface,
} from '@dhaaga/shared-abstraction-activitypub';

/**
 * Wrapper service to invoke provider functions
 */
class ActivityPubAdapterService {
	static adaptStatus(item: any, domain: string): StatusInterface {
		return ActivitypubStatusAdapter(item, domain);
	}

	static adaptManyStatuses(items: any[], domain: string): StatusInterface[] {
		if (items === undefined || items === null || !Array.isArray(items))
			return [];
		return items
			.filter((o) => !!o)
			.map((o) => ActivitypubStatusAdapter(o, domain));
	}

	static adaptUser(o: any, domain: string): UserInterface {
		return ActivityPubUserAdapter(o, domain);
	}

	static adaptManyUsers(items: any[], domain: string): UserInterface[] {
		if (items === undefined || items === null || !Array.isArray(items))
			return [];
		return items
			.filter((o) => !!o)
			.map((o) => ActivityPubUserAdapter(o, domain));
	}

	static adaptContextChain(
		apiResponse: any,
		domain: string,
	): StatusInterface[] {
		const ancestors = this.adaptManyStatuses(apiResponse.ancestors, domain);
		const descendants = this.adaptManyStatuses(apiResponse.descendants, domain);
		return [...ancestors, ...descendants];
	}
}

export default ActivityPubAdapterService;
