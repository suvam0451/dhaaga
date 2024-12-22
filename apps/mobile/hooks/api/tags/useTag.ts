import { useEffect, useState } from 'react';
import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { useQuery } from '@tanstack/react-query';
import {
	ActivityPubTagAdapter,
	TagInterface,
	TagType,
} from '@dhaaga/shared-abstraction-activitypub';

export function useTag(tag: string) {
	const { router, driver } = useGlobalState(
		useShallow((o) => ({
			router: o.router,
			driver: o.driver,
		})),
	);

	const [Data, setData] = useState<TagInterface | null>(null);

	async function api() {
		if (!router) return null;
		const { data, error } = await router.tags.get(tag);
		if (error) {
			console.log(error);
			return null;
		}
		return data;
	}

	// Queries
	const { status, data } = useQuery<TagType | null>({
		queryKey: ['tag', tag],
		queryFn: api,
		enabled: router !== null && tag !== null,
	});

	useEffect(() => {
		if (status !== 'success' || !data) return;
		setData(ActivityPubTagAdapter(data, driver));
	}, [data, status]);

	return { data: Data };
}
