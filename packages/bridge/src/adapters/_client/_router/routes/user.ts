import { ApiTargetInterface } from './_index.js';
import { ApiAsyncResult } from '../../../../utils/api-result.js';
import { UserObjectType } from '../../../../parsers/user.js';
import { DriverUserFindQueryType } from '../../../../types/query.types.js';
import { MastoApiAdapter, MisskeyApiAdapter, UserParser } from '@dhaaga/bridge';
import { Err, Ok } from '../../../../utils/index.js';
import { ApiErrorCode } from '../../../../types/result.types.js';
import { DriverService } from '../../../../services/driver.js';
import { AtprotoApiAdapter } from '../../bluesky/_router.js';
import { FollowerGetQueryDTO } from './accounts.js';
import { KeyExtractorUtil } from '../../../../utils/key-extractor.js';
import { ResultPage } from '../../../../utils/pagination.js';

class Route {
	private client: ApiTargetInterface;

	constructor(client: ApiTargetInterface) {
		this.client = client;
	}

	async findOne(
		query: DriverUserFindQueryType,
	): ApiAsyncResult<UserObjectType> {
		const driver = this.client.driver;
		const server = this.client.server!;

		switch (query.use) {
			case 'did': {
				// AT protocol exclusive
				const { data, error } = await this.client.accounts.get(query.did);
				if (error) return Err(ApiErrorCode.UNKNOWN_ERROR);
				return Ok(
					UserParser.parse<unknown>((data as any).data, driver, server!),
				);
			}
			case 'userId': {
				// AT protocol exclusive
				const { data, error } = await this.client.accounts.get(query.userId);
				if (error) return Err(ApiErrorCode.UNKNOWN_ERROR);
				return Ok(
					UserParser.parse<unknown>((data as any).data, driver, server!),
				);
			}
			/**
			 * Need to split for Misskey API
			 * and forward for MastoAPI
			 */
			case 'handle': {
				if (DriverService.supportsAtProto(driver)) {
					// fetch did for handle (not needed, if regex check passes)
					const { data: didData, error: didError } = await (
						this.client as AtprotoApiAdapter
					).accounts.getDid(query.handle);
					if (didError) return Err('E_Failed_Did_Lookup');

					const { data, error } = await this.client.accounts.get(
						didData?.data?.did,
					);
					if (error) throw new Error('Failed to fetch user for AtProto');
					return Ok(
						UserParser.parse<unknown>((data as any).data, driver, server),
					);
				} else if (DriverService.supportsMastoApiV1(this.client.driver)) {
					const res = await (this.client as MastoApiAdapter).accounts.lookup(
						query.handle,
					);
					if (res.error) return Err(ApiErrorCode.UNKNOWN_ERROR);
					return Ok(UserParser.parse(res.data, driver, server));
				} else if (DriverService.supportsMisskeyApi(this.client.driver)) {
					return Err(ApiErrorCode.OPERATION_UNSUPPORTED);
				} else {
					return Err(ApiErrorCode.OPERATION_UNSUPPORTED);
				}
			}
			/**
			 * Need to forward for Misskey API
			 * and merge for MastoAPI
			 */
			case 'webfinger': {
				if (DriverService.supportsMastoApiV1(this.client.driver)) {
					return Err(ApiErrorCode.OPERATION_UNSUPPORTED);
				} else if (DriverService.supportsMisskeyApi(this.client.driver)) {
					const findResult = await (
						this.client as MisskeyApiAdapter
					).accounts.findByWebfinger(query.webfinger);
					return Ok(UserParser.parse<unknown>(findResult.data, driver, server));
				} else {
					return Err(ApiErrorCode.OPERATION_UNSUPPORTED);
				}
			}
			default: {
				return Err(ApiErrorCode.OPERATION_UNSUPPORTED);
			}
		}
	}

	async getFollowers(
		query: FollowerGetQueryDTO,
	): ApiAsyncResult<ResultPage<UserObjectType>> {
		const result = await this.client.accounts.followers(query);
		return Ok(
			KeyExtractorUtil.getPage<UserObjectType>(result, (o) =>
				UserParser.parse<unknown[]>(o, this.client.driver, this.client.server!),
			),
		);
	}

	async getFollows(
		query: FollowerGetQueryDTO,
	): ApiAsyncResult<ResultPage<UserObjectType>> {
		const result = await this.client.accounts.followings(query);
		return Ok(
			KeyExtractorUtil.getPage<UserObjectType>(result, (o) =>
				UserParser.parse<unknown[]>(o, this.client.driver, this.client.server!),
			),
		);
	}
}

export { Route as UserRoute };
