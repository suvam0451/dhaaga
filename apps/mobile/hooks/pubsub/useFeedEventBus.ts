import type { FeedObjectType } from '@dhaaga/bridge';
import { useAppPublishers } from '#/states/global/hooks';
import { useEffect, useState } from 'react';

export function useFeedEventBusStore(input: string | FeedObjectType) {
	const { feedEventBus } = useAppPublishers();
	const [Feed, setFeed] = useState<FeedObjectType>(
		feedEventBus.read(typeof input === 'string' ? input : null),
	);

	/**
	 * Subscribe to updates on the post-object
	 * via the event bus.
	 */
	useEffect(() => {
		if (!input) return;
		const uuid = typeof input === 'string' ? input : input?.uri;
		if (!uuid) return;

		function update({ uuid }: { uuid: string }) {
			setFeed(feedEventBus.read(uuid));
		}

		if (typeof input !== 'string') {
			setFeed(feedEventBus.write(uuid, input));
		} else {
			update({ uuid });
		}
		feedEventBus.subscribe(uuid, update);
		return () => {
			feedEventBus.unsubscribe(uuid, update);
		};
	}, [input]);

	return { feed: Feed };
}

export function useFeedEventBusActions(input: string) {
	const { feedEventBus } = useAppPublishers();

	function toggleSubscription() {}
	function togglePin() {}

	return {
		toggleSubscription,
		togglePin,
	};
}
