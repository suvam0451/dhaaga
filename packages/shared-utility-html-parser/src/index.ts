import * as mfm from 'mfm-js';
import type { MfmNode } from 'mfm-js/built';
import { decode } from 'html-entities';
import HtmlParserService from './htmlparser2';

export type { MfmNode, MfmEmojiCode } from 'mfm-js/built';

/**
 * Stops at the pre-processing step
 * @param str
 */
export function preprocessPostContent(str: string) {
	// remove span tags
	str = HtmlParserService.cleanup(str);

	// Replace leading "https://" -- Used to shorten
	const removeHttps = /(<a.*?>)(https:\/\/)(.*?<\/a>)/gm;
	str = str.replaceAll(removeHttps, '$1$3');

	// replace links with href
	str = str.replaceAll(/<a .*?href="(.*?)".*?a>/g, '$1');

	// Replace  leading "#" -- Confuses mfm-js
	const rule3 = /(<a.*?>)(#+)(.+.*?<\/a>)/gm;
	str = str.replaceAll(rule3, '$1$3');
	return str;
}

/**
 * Utility function that
 * 1. Removes <p> tags
 * 2. Replaces &#39; with
 * 3. Replaces tag urls with #tag
 * 4. Splits paragraphs
 * @param str
 */
export function parseStatusContent(str: string) {
	let retval: MfmNode[][] = [];

	// remove span tags
	str = preprocessPostContent(str);

	const ex = /<p>(.*?)<\/p>/g;
	if (ex.test(str)) {
		for (const item of str.match(ex) || []) {
			const exOne = /<p>(.*?)<\/p>/;
			let currStr = item.match(exOne)![1];
			const mfmTree = mfm.parse(currStr);
			retval.push(mfmTree);
		}
	} else {
		const mfmTree = mfm.parse(str);
		retval.push(mfmTree);
	}

	return retval;
}

export function parseUsername(str: string) {
	return mfm.parse(str);
}

export function decodeHTMLString(str: string) {
	return decode(str);
}
