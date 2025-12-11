import { z } from 'zod';
import {
	ApiTargetInterface,
	AtprotoApiAdapter,
	MastoApiAdapter,
	MisskeyApiAdapter,
} from '#/client/index.js';
import { UserParser } from '#/parsers/index.js';
import { DriverService } from '#/services/driver.js';
import { ApiErrorCode } from '#/types/result.types.js';
import { AppBskyActorGetProfile } from '@atproto/api';

const DriverWebfingerSchema = z.object({
	username: z.string(),
	host: z.string().nullable(),
});

type DriverWebfingerType = z.infer<typeof DriverWebfingerSchema>;

const userFindQuerySchema = z
	.object({
		use: z.literal('did'),
		did: z.string(),
	})
	.or(
		z.object({
			use: z.literal('userId'),
			userId: z.string(),
		}),
	)
	.or(
		z.object({
			use: z.literal('handle'),
			handle: z.string(),
		}),
	)
	.or(
		z.object({
			use: z.literal('webfinger'),
			webfinger: DriverWebfingerSchema,
		}),
	);

type DriverUserFindQueryType = z.infer<typeof userFindQuerySchema>;

export { userFindQuerySchema };
export type { DriverWebfingerType, DriverUserFindQueryType };

export async function lookup(
	client: ApiTargetInterface,
	query: DriverUserFindQueryType,
) {
	const driver = client.driver;
	const server = client.server!;

	switch (query.use) {
		case 'did': {
			// AT protocol exclusive
			const data: AppBskyActorGetProfile.Response = await client.users.get(
				query.did,
			);
			return UserParser.parse<unknown>(data.data, driver, server!);
		}

		case 'userId': {
			const data = await client.users.get(query.userId);
			return UserParser.parse<unknown>(data, driver, server!);
		}

		/**
		 * Need to split for Misskey API
		 * and forward for MastoAPI
		 */
		case 'handle': {
			if (DriverService.supportsAtProto(driver)) {
				// fetch did for a handle (not needed, if regex check passes)
				const didData = await (client as AtprotoApiAdapter).users.getDid(
					query.handle,
				);

				const data: AppBskyActorGetProfile.Response = await client.users.get(
					didData?.data?.did!,
				);
				return UserParser.parse<unknown>(data.data, driver, server);
			} else if (DriverService.supportsMastoApiV1(client.driver)) {
				// FIXME: need to split this
				const data = await (client as MastoApiAdapter).users.lookup({
					username: query.handle,
					host: null,
				});
				return UserParser.parse(data, driver, server);
			} else if (DriverService.supportsMisskeyApi(client.driver)) {
				throw new Error(ApiErrorCode.OPERATION_UNSUPPORTED);
			} else {
				throw new Error(ApiErrorCode.OPERATION_UNSUPPORTED);
			}
		}

		/**
		 * Need to forward for Misskey API
		 * and merge for MastoAPI
		 */
		case 'webfinger': {
			if (DriverService.supportsMastoApiV1(client.driver)) {
				const data = await (client as MastoApiAdapter).users.lookup(
					query.webfinger,
				);
				return UserParser.parse<unknown>(data, driver, server);
			} else if (DriverService.supportsMisskeyApi(client.driver)) {
				const findResult = await (
					client as MisskeyApiAdapter
				).users.findByWebfinger(query.webfinger);
				return UserParser.parse<unknown>(findResult.data, driver, server);
			} else {
				throw new Error(ApiErrorCode.OPERATION_UNSUPPORTED);
			}
		}
		default: {
			throw new Error(ApiErrorCode.OPERATION_UNSUPPORTED);
		}
	}
}
