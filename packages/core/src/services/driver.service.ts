import { KNOWN_SOFTWARE } from '@dhaaga/bridge';

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
}

export { Service as DriverService };
