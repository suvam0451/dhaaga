import { ApiErrorCode } from '#/types/result.types.js';
import { BaseUrlNormalizationService } from '#/utils/urls.js';

const NODEINFO_10 = 'http://nodeinfo.diaspora.software/ns/schema/1.0';
const NODEINFO_20 = 'http://nodeinfo.diaspora.software/ns/schema/2.0';
const NODEINFO_21 = 'http://nodeinfo.diaspora.software/ns/schema/2.1';

type InstanceApi_SoftwareInfoDTO = {
	software: string;
	version: string | null;
};

type WelKnownNodeinfo = {
	links: {
		href: string;
		rel: string;
	}[];
};

type Nodeinfo10 = {
	software: {
		name: string;
		version: string;
	};
	metadata: {
		upstream?: {
			name: string;
		};
	};
};

type NodeInfo20 = Nodeinfo10;

type NodeInfo21 = NodeInfo20;

function getVersion(text: string) {
	const ex = /^([0-9]+.[0-9]+.[0-9]+)/;
	if (ex.test(text)) {
		return ex.exec(text)![1];
	}
	return null;
}

/**
 * get the software used by a (potential)
 * fediverse domain
 * @param urlLike
 */
async function getInstanceSoftware(
	urlLike: string,
): Promise<InstanceApi_SoftwareInfoDTO> {
	const controllerA = new AbortController();
	const controllerB = new AbortController();
	const timeoutA = setTimeout(() => controllerA.abort(), 5000);
	let timeoutB: NodeJS.Timeout | null = null;

	try {
		const result = await fetch(
			BaseUrlNormalizationService.appendHttps(urlLike) +
				'/.well-known/nodeinfo',
			{
				signal: controllerA.signal,
				method: 'GET',
			},
		);

		if (!result.ok) {
			throw new Error(ApiErrorCode.UNKNOWN_ERROR);
		}

		const nodeInfo: WelKnownNodeinfo = await result.json();

		const nodeType = nodeInfo.links.find((l) =>
			[NODEINFO_21, NODEINFO_20, NODEINFO_10].includes(l.rel),
		);
		if (!nodeType) throw new Error('instance is missing nodeinfo');

		switch (nodeType.rel) {
			case NODEINFO_10:
			case NODEINFO_20:
			case NODEINFO_21: {
				timeoutB = setTimeout(() => controllerA.abort(), 5000);

				const res = await fetch(nodeType.href, {
					method: 'GET',
					signal: controllerB.signal,
				});
				const resJson: NodeInfo21 = await res.json();
				switch (resJson.software.name) {
					case 'mastodon':
					case 'misskey':
					case 'pleroma':
					case 'akkoma':
					case 'friendica':
					case 'firefish':
					case 'gotosocial':
					case 'lemmy':
					case 'peertube':
					case 'pixelfed':
					case 'sharkey':
					case 'hometown':
					case 'cherrypick':
					case 'iceshrimp':
					case 'kmyblue':
					// map to misskey
					case 'meisskey': {
						return {
							software: resJson.software.name,
							version: getVersion(resJson.software.version),
						};
					}
					// NOTE: will not implement
					case 'writefreely': {
						// js api is outdated
						throw new Error(ApiErrorCode.FEATURE_UNSUPPORTED);
					}
					default: {
						return {
							software: 'unknown',
							version: 'N/A',
						};
					}
				}
			}
		}
		throw new Error(ApiErrorCode.UNKNOWN_ERROR);
	} catch (e: any) {
		throw new Error(e);
	} finally {
		clearTimeout(timeoutA);
		if (timeoutB) clearTimeout(timeoutB);
	}
}

/**
 * try to identify the backend software
 * used by a (potential) fediverse instance
 * using a given url
 * @param urlLike
 */
export async function identifyBackendSoftware(
	urlLike: string,
): Promise<InstanceApi_SoftwareInfoDTO> {
	return getInstanceSoftware(urlLike);
}
