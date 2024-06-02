import {
  ActivitypubStatusAdapter,
  ActivityPubUserAdapter,
  StatusInterface
}
  from "@dhaaga/shared-abstraction-activitypub/src";

/**
 * Wrapper service to invoke provider functions
 */
class ActivityPubAdapterService {
  static async adaptManyStatuses(items: any[], domain: string): Promise<StatusInterface[]> {
    return items.map((o) =>
        ActivitypubStatusAdapter(o, domain)
    )
  }

  static async adaptContextChain(apiResponse: any, domain: string): Promise<StatusInterface[]> {
    const ancestors = await this.adaptManyStatuses(apiResponse.ancestors, domain)
    const descendants = await this.adaptManyStatuses(apiResponse.descendants, domain)
    return [...ancestors, ...descendants]
  }

  static async adaptUser(o: any, domain: string) {
    return ActivityPubUserAdapter(o, domain)
  }
}

export default ActivityPubAdapterService;