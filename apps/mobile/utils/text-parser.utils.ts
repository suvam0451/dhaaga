const URL_REGEX =
	/[$|\W](https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&\/=]*[-a-zA-Z0-9@%_+~#\/=])?)/;

type ParseResult = {
	start: number;
	text: string;
}[];

class TextParserUtil {
	/**
	 * NOTE: offset by one to account for the leading space
	 * @param text
	 */
	static findUrlsInText(text: string): ParseResult {
		const matches = text.matchAll(URL_REGEX);

		let retval: ParseResult = [];
		// @ts-ignore-next-line
		for (const match of matches) {
			retval.push({ start: match.index, text: match[1] });
		}
		return retval;
	}
}

export default TextParserUtil;
