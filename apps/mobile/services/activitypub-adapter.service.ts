import { ActivitypubStatusAdapter, PostTargetInterface } from '@dhaaga/bridge';

/**
 * Wrapper service to invoke provider functions
 *
 * @depreacted
 */
class ActivityPubAdapterService {
	static adaptStatus(item: any, domain: string): PostTargetInterface | null {
		return ActivitypubStatusAdapter(item, domain);
	}

	static adaptManyStatuses(
		items: any[],
		domain: string,
	): PostTargetInterface[] {
		if (items === undefined || items === null || !Array.isArray(items))
			return [];
		return items
			.filter((o) => !!o)
			.map((o) => ActivitypubStatusAdapter(o, domain))
			.filter((o) => o !== null);
	}
}

export default ActivityPubAdapterService;
