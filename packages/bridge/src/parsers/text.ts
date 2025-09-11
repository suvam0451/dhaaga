// import { parseStatusContent, preprocessPostContent } from '@dhaaga/bridge';

import { parseStatusContent, preprocessPostContent } from '../index.js';

export class TextParser {
	/**
	 * Is the input url a hashtag?
	 * @param url
	 * @returns the hashtag text or null
	 */
	static isHashtag(url: string): string | null {
		if (!url) return null;
		const tagRegex = /^https?:\/\/(.*?)\/tag\/(.*?)\/?$/;
		if (!tagRegex.test(url)) return null;

		const match = tagRegex.exec(url);
		return match === null ? null : (match[2] as string);
	}

	static findHashtags(input: string) {
		if (!input) return [];
		input = preprocessPostContent(input);
		const setter = new Set<string>();
		const ex = /#([a-zA-Z_-]+)/gm;

		const res = input.matchAll(ex);
		for (let match of res) {
			if (!setter.has(match[1]!)) {
				setter.add(match[1]!);
			}
		}

		return Array.from(setter);
	}

	static findMentions(input: string) {
		if (!input) return [];
		const ex = new RegExp('<a.*?href="(.*?)".*?>@(.*?)</a>', 'g');
		const matches = Array.from(input.matchAll(ex));
		return matches.map((o) => ({ url: o[1], text: o[2], resolved: false }));
	}

	static findHyperlinks(input: string) {
		const mp = new Map<string, string>();
		const ex = /<a.*?href="(.*?)".*?>(.*?)<\/a>/gu;

		const aRefContentCleanupRegex = /(<([^>]+)>)/gi;

		const matches = input.matchAll(ex);
		for (const match of matches) {
			const result = match[2]!.replace(aRefContentCleanupRegex, '');
			mp.set(match[1]!, result);
		}
		return mp;
	}

	/**
	 * Prepares the text content
	 * for consumption by a parser
	 * library (like mfm-js)
	 * @param input
	 * @param log
	 */
	static preprocessPostContent(input: string, log?: boolean) {
		return parseStatusContent(input, log);
	}

	static removeHttps(url: string) {
		let result = url.replace(/^https?:\/\//, '');
		result = result.replace(/\//g, '');
		console.log(result);
	}

	/**
	 * converts a mention object into an
	 * ActivityPub handle
	 * @param input input text
	 * @param server
	 * @param username
	 */
	static mentionTextToHandle(
		input: string,
		server: string,
		username: string,
	): { text: string; me: boolean } {
		if (!input) return { text: input, me: false };
		try {
			let retval = input;

			/**
			 * Try resolving as a remote mention
			 */
			const ex = new RegExp(`@?(.*?)@${server}`, 'g');
			const res = Array.from(input.matchAll(ex));
			if (res.length > 0) {
				retval = `${res[0]![1]}`;
			} else {
				retval = `${input}`;
			}

			/**
			 * Fallback to resolving as local mention
			 */
			const removeSpanEx = /<span>(.*?)<\/span>/g;
			const removeSpanRes = Array.from(input.matchAll(removeSpanEx));
			if (removeSpanRes.length > 0) {
				retval = `${removeSpanRes[0]![1]}`;
			}
			const _text = retval[0] === '@' ? retval : '@' + retval;
			return {
				text: retval[0] === '@' ? retval : '@' + retval,
				me: _text === `@${username}`,
			};
		} catch (e) {
			console.log(
				'[WARN]: could not resolve mention object to a valid protocol handle',
				input,
				e,
			);
			return { text: input, me: false };
		}
	}
}
