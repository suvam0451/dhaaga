import * as mfm from 'mfm-js';
import type { MfmNode } from 'mfm-js/built';
import { decode } from 'html-entities';
import HtmlParserService from './htmlparser2.js';
import ActivitypubHelper from './activitypub.js';

export { ActivitypubHelper };
export type { MfmNode, MfmEmojiCode } from 'mfm-js/built';

/**
 * Stops at the pre-processing step
 * @param str
 */
export function preprocessPostContent(str: string) {
	// remove span tags
	str = HtmlParserService.cleanup(str);
	// console.log('[INFO]: cleaned up input', str);

	// Replace  leading "#" -- Confuses mfm-js
	// const ruleA = /(<a.*?>)(#+)(.+.*?<\/a>)/gm;
	// str = str.replaceAll(ruleA, '$1$3');

	// Replace leading "https://" -- Used to shorten
	const ruleB = /(<a.*?>)(https:\/\/)(.*?<\/a>)/gm;
	str = str.replaceAll(ruleB, '$1$3');

	// replace links with href
	str = str.replaceAll(/<a .*?href="(.*?)".*?a>/g, '$1');
	return str;
}

/**
 * Utility function that
 * 1. Removes <p> tags
 * 2. Replaces &#39; with
 * 3. Replaces tag urls with #tag
 * 4. Splits paragraphs
 * @param str
 * @param log
 */
export function parseStatusContent(str: string, log?: boolean) {
	let retval: MfmNode[][] = [];

	if (log) console.log('[INFO]: html input', str);
	str = preprocessPostContent(str);
	if (log) console.log('[INFO]: html cleaned', str);

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
