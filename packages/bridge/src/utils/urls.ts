export class BaseUrlNormalizationService {
	/**
	 * Ensures the URL starts with https://, strips the path, query, and hash,
	 * and returns the base URL (with protocol and hostname).
	 *
	 * Example:
	 * - input: 'http://example.com/path?x=1'
	 * - output: 'https://example.com'
	 */
	static appendHttps(input: string): string {
		try {
			const hasProtocol = /^https?:\/\//i.test(input);
			const url = new URL(hasProtocol ? input : `https://${input}`);

			// Force protocol to https
			url.protocol = 'https:';

			// Strip path, query, hash
			url.pathname = '';
			url.search = '';
			url.hash = '';

			return url.toString().replace(/\/$/, ''); // remove trailing slash
		} catch (e) {
			throw new Error(`Invalid URL: ${input}`);
		}
	}

	/**
	 * Strips http(s)://, removes path, query, hash,
	 * and returns just the hostname (without a protocol).
	 *
	 * Example:
	 * - input: 'https://example.com/path'
	 * - output: 'example.com'
	 */
	static stripHttps(input: string): string {
		try {
			const hasProtocol = /^https?:\/\//i.test(input);
			const url = new URL(hasProtocol ? input : `https://${input}`);

			let host = url.host; // Includes port (e.g., 'localhost:8080')

			// Remove the leading "www."
			host = host.replace(/^www\./i, '');

			return host;
		} catch (e) {
			throw new Error(`Invalid URL: ${input}`);
		}
	}
}
