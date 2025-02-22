import ApiDriver, {
	RestClientCreateDTO,
} from '../adapters/_client/_interface.js';
import { ApiErrorCode, BlueskyRestClient, KNOWN_SOFTWARE } from '../index.js';
import { AppAtpSessionData } from '../types/atproto.js';
import MisskeyRestClient from '../adapters/_client/misskey/_router.js';
import PleromaRestClient from '../adapters/_client/pleroma/_router.js';
import MastodonRestClient from '../adapters/_client/mastodon/_router.js';
import { ApiResult } from '../utils/api-result.js';
import { Err, Ok } from '../utils/index.js';

class Service {
	static supportsMastoApiV1(driver: KNOWN_SOFTWARE | string) {
		return [
			KNOWN_SOFTWARE.MASTODON,
			KNOWN_SOFTWARE.PLEROMA,
			KNOWN_SOFTWARE.AKKOMA,
			KNOWN_SOFTWARE.KMYBLUE,
		].includes(driver as KNOWN_SOFTWARE);
	}

	static supportsMastoApiV2(driver: string) {
		return [KNOWN_SOFTWARE.MASTODON].includes(driver as KNOWN_SOFTWARE);
	}

	static supportsMisskeyApi(driver: string) {
		return [
			KNOWN_SOFTWARE.MISSKEY,
			KNOWN_SOFTWARE.SHARKEY,
			KNOWN_SOFTWARE.FIREFISH,
			KNOWN_SOFTWARE.ICESHRIMP,
			KNOWN_SOFTWARE.CHERRYPICK,
			KNOWN_SOFTWARE.MEISSKEY,
		].includes(driver as KNOWN_SOFTWARE);
	}

	static supportsAtProto(driver: string) {
		return [KNOWN_SOFTWARE.BLUESKY].includes(driver as KNOWN_SOFTWARE);
	}

	static supportsPleromaApi(driver: string) {
		return [KNOWN_SOFTWARE.PLEROMA, KNOWN_SOFTWARE.AKKOMA].includes(
			driver as KNOWN_SOFTWARE,
		);
	}

	static canBookmark(driver: KNOWN_SOFTWARE | string) {
		return (
			Service.supportsMastoApiV1(driver) || Service.supportsMisskeyApi(driver)
		);
	}

	static canLike(driver: KNOWN_SOFTWARE | string) {
		return (
			Service.supportsAtProto(driver) || Service.supportsMastoApiV1(driver)
		);
	}

	static canReact(driver: KNOWN_SOFTWARE | string) {
		return (
			Service.supportsMisskeyApi(driver) || Service.supportsPleromaApi(driver)
		);
	}

	static canReactMultiple(driver: KNOWN_SOFTWARE | string) {
		return Service.supportsPleromaApi(driver);
	}

	static canQuote(driver: KNOWN_SOFTWARE | string) {
		return (
			Service.supportsAtProto(driver) || Service.supportsMisskeyApi(driver)
		);
	}

	/**
	 * This client should be generated at runtime
	 */
	static generateApiClient(
		driver: KNOWN_SOFTWARE | string,
		payload: RestClientCreateDTO | AppAtpSessionData,
	): ApiResult<ApiDriver> {
		if (Service.supportsAtProto(driver))
			return Ok(new BlueskyRestClient(payload as AppAtpSessionData));

		if (Service.supportsMisskeyApi(driver))
			return Ok(new MisskeyRestClient(payload as RestClientCreateDTO));

		if (Service.supportsPleromaApi(driver))
			return Ok(new PleromaRestClient(payload as RestClientCreateDTO));

		if (Service.supportsMastoApiV2(driver))
			return Ok(new MastodonRestClient(payload as RestClientCreateDTO));

		return Err(ApiErrorCode.INCOMPATIBLE_DRIVER);
	}
}

export { Service as DriverService };
