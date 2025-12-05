import { RestClientCreateDTO } from '../adapters/_client/_interface.js';
import { AtprotoApiAdapter, KNOWN_SOFTWARE } from '../index.js';
import { AppAtpSessionData } from '../types/atproto.js';
import {
	ApiTargetInterface,
	MisskeyApiAdapter,
	PleromaApiAdapter,
	MastoApiAdapter,
} from '#/client/index.js';

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
		software: KNOWN_SOFTWARE | string,
		instance: string,
		payload: RestClientCreateDTO | AppAtpSessionData,
	): ApiTargetInterface {
		if (Service.supportsAtProto(software))
			return new AtprotoApiAdapter(
				software,
				instance,
				payload as AppAtpSessionData,
			);

		if (Service.supportsMisskeyApi(software)) {
			return new MisskeyApiAdapter(
				software,
				instance,
				payload as RestClientCreateDTO,
			);
		}

		if (Service.supportsPleromaApi(software))
			return new PleromaApiAdapter(
				software,
				instance,
				payload as RestClientCreateDTO,
			);

		if (Service.supportsMastoApiV2(software))
			return new MastoApiAdapter(
				software,
				instance,
				payload as RestClientCreateDTO,
			);

		throw new Error(`Software (${software}) not supported by @dhaaga/bridge`);
	}
}

export { Service as DriverService };
