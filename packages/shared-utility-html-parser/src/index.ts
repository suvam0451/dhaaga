import type {MfmNode} from "mfm-js";
import {parse} from "mfm-js";
import {decode} from "html-entities";

export type {MfmNode, MfmEmojiCode} from "mfm-js";

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

  // Replace leading "https://" -- Used to shorten
  const removeHttps = /(<a.*?>)(https:\/\/)(.*?<\/a>)/gm;
  str = str.replaceAll(removeHttps, "$1$3")

  // Replace tags with #tag -- Used for highlighting
  const tagExx = /<a href=".*?\/tags\/(.*?)\".*?<\/a>/gm;
  str = str.replaceAll(tagExx, "#$1");

  // NOTE: for corner case reports
  // let trigger = false;
  // @ts-ignore
  // if (str.includes("role_nsfw")) {
  // 	console.log("important string", str);
  // 	trigger = true;
  // }

  // replace links with href
  str = str.replaceAll(/<a .*?href="(.*?)".*?a>/g, "$1");


  // Replace  leading "#" -- Confuses mfm-js
  const rule3 = /(<a.*?>)(#+)(.+.*?<\/a>)/gm
  str = str.replaceAll(rule3, "$1$3");

  console.log("final output", str)

  // [BUG] [mfm-js] -- 0.23/24.0 -- broken, if link text itself is a link
  // [FIX] remove "https://" from text


  const ex = /<p>(.*?)<\/p>/g;
  if (ex.test(str)) {
    for (const item of str.match(ex) || []) {
      const exOne = /<p>(.*?)<\/p>/;
      let currStr = item.match(exOne)![1];

      currStr = currStr.replaceAll("&#39;", "'");
      currStr = currStr.replaceAll("<span>", "");
      currStr = currStr.replaceAll("</span>", "");
      currStr = currStr.replaceAll(/<span.*?>/g, "");

      const mfmTree = parse(currStr);
      retval.push(mfmTree);
    }
  } else {
    // console.log("[HTML Parser] misskey detected");
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

export function parseUsername(str: string) {
  return parse(str);
}

export function decodeHTMLString(str: string) {
  return decode(str);
}
