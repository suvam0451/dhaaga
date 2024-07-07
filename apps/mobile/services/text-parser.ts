import {
	parseStatusContent,
	preprocessPostContent,
} from '@dhaaga/shared-abstraction-activitypub';

class TextParserService {
	static findHashtags(input: string) {
		input = preprocessPostContent(input);

		const setter = new Set<string>();
		const ex = /#([a-zA-Z_-]+)/gm;

		const res = input.matchAll(ex);
		// @ts-ignore-next-line
		for (let match of res) {
			console.log(match[1]);
			if (!setter.has(match[1])) {
				setter.add(match[1]);
			}
		}

		return Array.from(setter);
	}

	static findMentions(input: string) {
		const ex = new RegExp('<a.*?href="(.*?)".*?>@(.*?)</a>', 'g');
		const matches = Array.from(input.matchAll(ex));
		return matches.map((o) => ({ url: o[1], text: o[2] }));
	}

	static findHyperlinks(input: string) {
		const mp = new Map<string, string>();
		const ex = /<a.*?href="(.*?)".*?>(.*?)<\/a>/gu;

		const aRefContentCleanupRegex = /(<([^>]+)>)/gi;

		const matches = input.matchAll(ex);
		// @ts-ignore-next-line
		for (const match of matches) {
			const result = match[2].replace(aRefContentCleanupRegex, '');
			mp.set(match[1], result);
		}
		return mp;
	}

	/**
	 * Prepares the text content
	 * for consumption by a parser
	 * library (like mfm-js)
	 * @param input
	 */
	static preprocessPostContent(input: string) {
		return parseStatusContent(input);
	}

	// static findHashtagsFromRaw(input: string) {
	//  return TextParserService.findHashtags(
	// 	 TextParserService.preprocessPostContent(input)
	//  )
	// }
}

export default TextParserService;
