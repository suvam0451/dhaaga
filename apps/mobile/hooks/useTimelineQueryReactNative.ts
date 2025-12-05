import { AppTimelineQuery } from '#/features/timelines/api/useTimelineController';
import { useQuery } from '@tanstack/react-query';
import { DhaagaJsTimelineQueryOptions } from '@dhaaga/bridge';
import { TimelineFetchMode } from '@dhaaga/core';
import {
	useAppAcct,
	useAppApiClient,
} from '#/hooks/utility/global-state-extractors';
import { feedUnifiedQueryOptions } from '@dhaaga/react';

type TimelineQueryParams = {
	type: TimelineFetchMode;
	query?: AppTimelineQuery;
	opts?: DhaagaJsTimelineQueryOptions;
	minId?: string;
	maxId?: string;
	sessionId?: string;
};

/**
 * A wrapper around the unified timeline query options,
 * intended for React Native to read and inject the
 * account identifier and relevant client/driver/server.
 *
 */
function useTimelineQueryReactNative(params: TimelineQueryParams) {
	const { client, driver, server } = useAppApiClient();
	const { acct } = useAppAcct();

	return useQuery(
		feedUnifiedQueryOptions(client, driver, server, acct.identifier, params),
	);
}

export default useTimelineQueryReactNative;
