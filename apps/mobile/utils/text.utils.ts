const URL_REGEX_OLD =
	/[$|\W](https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&\/=]*[-a-zA-Z0-9@%_+~#\/=])?)/;

const URL_REGEX =
	/^(https?|ftp):\/\/([A-Za-z0-9-]+\.)+[A-Za-z]{2,6}(:[0-9]+)?(\/[^\s]*)?$/;

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

	/**
	 * Removes www and http(s) from front
	 * @param input input url
	 */
	static displayNameForLink(input: string) {
		if (!URL_REGEX.test(input)) return input;

		const stepA = input?.replace(/(https:\/\/)(.+)/, '$2');
		return stepA?.replace(/(www\.)(.+)/, '$2');
	}

	static shorten(input: string, maxLen: number = 32) {
		if (!input) return input;
		if (input.length > maxLen) {
			return input.substring(0, maxLen) + '...';
		}
		return input;
	}
}

export default TextParserUtil;
