import { KNOWN_SOFTWARE } from '../client/utils/driver.js';
import { DriverService } from './driver.js';

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

	/**
	 * ActivityPub handle to webfinger
	 * lookup compatible object
	 * @param handle handle resolved by app
	 * @param server home server
	 */
	static splitHandle(handle: string, server: string) {
		const splits = handle.split('@');
		if (splits.length === 3) {
			return {
				username: splits[1],
				host: server === splits[2] ? null : splits[1],
				handle,
			};
		} else if (splits.length === 2) {
			return {
				username: splits[1],
				host: null,
				handle,
			};
		}
	}
}

export default ActivitypubHelper;
