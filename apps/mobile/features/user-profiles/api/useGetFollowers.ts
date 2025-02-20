import { useQuery } from '@tanstack/react-query';
import { AppBskyGraphGetFollowers } from '@atproto/api';
import { useAppApiClient } from '../../../hooks/utility/global-state-extractors';
import { AppResultPageType } from '../../../types/app.types';
import { UserObjectType, UserParser, DriverService } from '@dhaaga/core';

const defaultResult = {
	success: true,
	maxId: null,
	minId: null,
	items: [],
};

type UserResultPage = AppResultPageType<UserObjectType>;

function useGetFollowers(acctId: string, maxId?: string) {
	const { driver, client, server } = useAppApiClient();

	async function api() {
		const { data, error } = await client.accounts.followers({
			id: acctId,
			limit: 10,
			maxId,
			allowPartial: true,
		});
		if (error) throw new Error(error.message);

		if (DriverService.supportsAtProto(driver)) {
			const _data = (data as AppBskyGraphGetFollowers.Response).data;
			return {
				success: true,
				maxId: _data.cursor,
				minId: null,
				items: UserParser.parse<unknown[]>(_data.followers, driver, server),
			};
		} else if (DriverService.supportsMisskeyApi(driver)) {
			return {
				items: UserParser.parse<unknown[]>(
					(data as any).data.map((o: any) => o.follower),
					driver,
					server,
				),
				maxId: (data as any).data[(data as any).data.length - 1].id,
				minId: null,
				success: true,
			};
		}

		return {
			items: UserParser.parse<unknown[]>((data as any)?.data, driver, server),
			maxId: (data as any)?.data?.maxId,
			minId: null,
			success: true,
		};
	}

	// Queries
	return useQuery<UserResultPage>({
		queryKey: ['followers', acctId, maxId],
		queryFn: api,
		enabled: !!client,
		initialData: defaultResult,
	});
}

export default useGetFollowers;
