import { parse } from "mfm-js";
import type { MfmNode } from "mfm-js";
import { decode } from "html-entities";
export type { MfmNode, MfmEmojiCode } from "mfm-js";

/**
 * Utility function that
 * 1. Removes <p> tags
 * 2. Replaces &#39; with '
 * 3. Replaces tag urls with #tag
 * 4. Splits paragraphs
 * @param str
 */
export function parseStatusContent(str: string) {
	let retval: MfmNode[][] = [];

	const ex = new RegExp(/<p>(.*?)<\/p>/, "g");
	let new_container;

	// str = str.replaceAll("<br>", "\n")
	// console.log(str)

	// replace tags with #tag
	const tagExx = /<a href=".*?\/tags\/(.*?)\".*?<\/a>/g;
	str = str.replaceAll(tagExx, "#$1");

	// NOTE: for corner case reports
	// let trigger = false;
	// @ts-ignore
	// if (str.includes("role_nsfw")) {
	// 	console.log("important string", str);
	// 	trigger = true;
	// }

	// replace linsk with href
	str = str.replaceAll(/<a href=\"(.*?)".*?a>/g, "$1");

	// for masto-dono
	if (ex.test(str)) {
		while ((new_container = ex.exec(str)) !== null) {
			let currStr = new_container[1];
			currStr = currStr.replaceAll("&#39;", "'");
			currStr = currStr.replaceAll("<span>", "");
			currStr = currStr.replaceAll("</span>", "");
			currStr = currStr.replaceAll(/<span.*?>/g, "");

			const mfmTree = parse(currStr);
			retval.push(mfmTree);
		}
	} else {
		let currStr = str;
		currStr = currStr.replaceAll("&#39;", "'");
		currStr = currStr.replaceAll("<span>", "");
		currStr = currStr.replaceAll("</span>", "");
		currStr = currStr.replaceAll(/<span.*?>/g, "");

		const mfmTree = parse(currStr);
		retval.push(mfmTree);
	}

	return retval;
}

export function decodeHTMLString(str: string) {
	return decode(str);
}
