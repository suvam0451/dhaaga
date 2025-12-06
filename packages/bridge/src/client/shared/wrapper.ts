import {
	ApiTargetInterface,
	MastoApiAdapter,
	MisskeyApiAdapter,
	AtprotoApiAdapter,
} from '#/client/index.js';
import { UserParser } from '#/parsers/user.js';
import { DriverUserFindQueryType } from '#/types/query.types.js';
import { ApiErrorCode } from '#/types/result.types.js';
import { DriverService } from '#/services/driver.js';
import { FollowerGetQueryDTO } from '../collections/accounts/_interface.js';
import { KeyExtractorUtil } from '#/utils/key-extractor.js';
import { ResultPage } from '#/utils/pagination.js';
import { AppBskyActorGetProfile } from '@atproto/api';
import { UserObjectType } from '#/types/index.js';

class Route {
	private client: ApiTargetInterface;

	constructor(client: ApiTargetInterface) {
		this.client = client;
	}

	async findOne(query: DriverUserFindQueryType): Promise<UserObjectType> {
		const driver = this.client.driver;
		const server = this.client.server!;

		switch (query.use) {
			case 'did': {
				// AT protocol exclusive
				const data: AppBskyActorGetProfile.Response =
					await this.client.accounts.get(query.did);
				return UserParser.parse<unknown>(data.data, driver, server!);
			}

			case 'userId': {
				const data = await this.client.accounts.get(query.userId);
				return UserParser.parse<unknown>(data, driver, server!);
			}

			/**
			 * Need to split for Misskey API
			 * and forward for MastoAPI
			 */
			case 'handle': {
				if (DriverService.supportsAtProto(driver)) {
					// fetch did for a handle (not needed, if regex check passes)
					const didData = await (
						this.client as AtprotoApiAdapter
					).accounts.getDid(query.handle);

					const data: AppBskyActorGetProfile.Response =
						await this.client.accounts.get(didData?.data?.data?.did!);
					return UserParser.parse<unknown>(data.data, driver, server);
				} else if (DriverService.supportsMastoApiV1(this.client.driver)) {
					// FIXME: need to split this
					const data = await (this.client as MastoApiAdapter).accounts.lookup({
						username: query.handle,
						host: null,
					});
					return UserParser.parse(data, driver, server);
				} else if (DriverService.supportsMisskeyApi(this.client.driver)) {
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
				if (DriverService.supportsMastoApiV1(this.client.driver)) {
					const data = await (this.client as MastoApiAdapter).accounts.lookup(
						query.webfinger,
					);
					return UserParser.parse<unknown>(data, driver, server);
				} else if (DriverService.supportsMisskeyApi(this.client.driver)) {
					const findResult = await (
						this.client as MisskeyApiAdapter
					).accounts.findByWebfinger(query.webfinger);
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

	/**
	 * These perform key extraction on the results,
	 * Basically wrappers
	 * @param query
	 */
	async getFollowers(
		query: FollowerGetQueryDTO,
	): Promise<ResultPage<UserObjectType>> {
		const result = await this.client.accounts.getFollowers(query);
		return KeyExtractorUtil.getPage<UserObjectType>(result, (o) =>
			UserParser.parse<unknown[]>(o, this.client.driver, this.client.server!),
		);
	}

	async getFollows(
		query: FollowerGetQueryDTO,
	): Promise<ResultPage<UserObjectType>> {
		const result = await this.client.accounts.getFollowings(query);
		return KeyExtractorUtil.getPage<UserObjectType>(result, (o) =>
			UserParser.parse<unknown[]>(o, this.client.driver, this.client.server!),
		);
	}
}

export { Route as UserRoute };
