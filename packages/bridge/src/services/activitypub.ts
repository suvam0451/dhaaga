import { ApiErrorCode, LibraryResponse } from '../types/result.types.js';
import { KNOWN_SOFTWARE } from '../data/driver.js';
import { DriverService } from './driver.js';
import { BaseUrlNormalizationService } from '../utils/urls.js';

const NODEINFO_10 = 'http://nodeinfo.diaspora.software/ns/schema/1.0';
const NODEINFO_20 = 'http://nodeinfo.diaspora.software/ns/schema/2.0';
const NODEINFO_21 = 'http://nodeinfo.diaspora.software/ns/schema/2.1';

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

class ActivitypubHelper {
	static removeURLPrefixes(link: string) {
		// Remove http:// or https://
		let cleanedLink = link.replace(/^https?:\/\//, '');

		// Remove www.
		cleanedLink = cleanedLink.replace(/^www\./, '');

		return cleanedLink;
	}

	/**
	 *
	 * @param url preferably using instanceUrl
	 * @param myDomain
	 * @param driver
	 */
	static getHandle(url: string, myDomain: string, driver?: string) {
		if (DriverService.supportsAtProto(driver || KNOWN_SOFTWARE.UNKNOWN))
			return url;

		const ex = /^https?:\/\/(.*?)\/(.*?)/;
		const subdomainExtractUrl = /^https?:\/\/(.*?)\/?/;
		/**
		 * - pixelfed does not use @ prefix
		 */
		const usernameExtract = /^https?:\/\/(.*?)\/@?(.*?)$/;
		const bridged = /^https?:\/\/(.*?)\/r\/(https?:\/\/)?(.*?)\/?$/;
		const pleromaUsernameExtract = /https:\/\/(.*?)\/users\/(.*?)$/;
		const lemmyUsernameExtract = /https:\/\/(.*?)\/u\/(.*?)$/;

		let ourUrl = '';
		let theirUsername = '';
		let theirUrl = '';

		if (ex.test(myDomain)) {
			// don't need username
			ourUrl = myDomain.match(subdomainExtractUrl)![1];
		} else {
			ourUrl = myDomain;
		}

		if (pleromaUsernameExtract.test(url)) {
			const x = url.match(pleromaUsernameExtract);
			theirUrl = x![1];
			theirUsername = x![2];
		} else if (lemmyUsernameExtract.test(url)) {
			const x = url.match(lemmyUsernameExtract);
			theirUrl = x![1];
			theirUsername = x![2];
		} else if (usernameExtract.test(url)) {
			const x = url.match(usernameExtract);
			theirUrl = x![1];
			theirUsername = x![2];
		}

		if (theirUsername === '') {
			if (bridged.test(url)) {
				const x = url.match(bridged);
				const bridge = x![1];
				const web = x![3];
				return `${this.removeURLPrefixes(web)} (via ${bridge})`;
			}
			// console.info('[WARN]: failed to resolve fedi handle', url, myDomain);
			return '<invalid>';
		}
		return ourUrl === theirUrl
			? `@${theirUsername}`
			: `@${theirUsername}@${theirUrl}`;
	}

	static convertInstanceUrlHttps(url: string) {
		// Check if the url already starts with http:// or https://
		if (!/^https?:\/\//i.test(url)) {
			// If not, prepend https:// to the url
			url = 'https://' + url;
		}
		return url;
	}

	static getInstanceUrlFromHandle(input: string, myDomain: string) {
		const sameServerUser = /^@([a-zA-Z_0-9]+)$/;
		if (sameServerUser.test(input)) {
			return this.convertInstanceUrlHttps(myDomain);
		}

		const remoteHandleRegex = /^@([a-zA-Z_0-9]+)@([a-zA-Z_0-9.]+)$/;
		if (remoteHandleRegex.test(input)) {
			const match = remoteHandleRegex.exec(input);
			if (!match) return null;
			const retval = this.convertInstanceUrlHttps(match[2]);
			return this.convertInstanceUrlHttps(retval);
		}
		return '';
	}

	private static getVersion(text: string) {
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
	static async getInstanceSoftware(
		urlLike: string,
	): Promise<LibraryResponse<any>> {
		const controllerA = new AbortController();
		const controllerB = new AbortController();
		const timeoutA = setTimeout(() => controllerA.abort(), 5000);
		let timeoutB: number | null = null;

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
				return {
					error: {
						code: ApiErrorCode.UNKNOWN_ERROR,
					},
				};
			}

			const nodeInfo: WelKnownNodeinfo = await result.json();

			const nodeType = nodeInfo.links.find((l) =>
				[NODEINFO_21, NODEINFO_20, NODEINFO_10].includes(l.rel),
			);
			if (!nodeType)
				return {
					error: {
						message: 'E_MISSING_NODE_INFO',
						code: 'E_MISSING_NODE_INFO',
					},
				};

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
								data: {
									software: resJson.software.name,
									version: this.getVersion(resJson.software.version),
								},
							};
						}
						// NOTE: will not implement
						case 'writefreely': {
							// js api is outdated
							return {
								error: {
									code: ApiErrorCode.FEATURE_UNSUPPORTED,
								},
							};
						}
						default: {
							return {
								data: {
									software: 'unknown',
									version: 'N/A',
								},
							};
						}
					}
				}
			}
			return {
				error: {
					code: ApiErrorCode.UNKNOWN_ERROR,
				},
			};
		} catch (e: any) {
			if (e.code) {
				return {
					error: {
						code: e.code,
						message: e.code,
					},
				};
			}
			return {
				error: {
					code: ApiErrorCode.UNKNOWN_ERROR,
				},
			};
		} finally {
			clearTimeout(timeoutA);
			if (timeoutB) clearTimeout(timeoutB);
		}
	}
}

export default ActivitypubHelper;
