class AppHtmlParser {
	private readonly raw: string;
	result: string;

	constructor(input: string) {
		this.raw = input;
		this.result = input;
	}

	removeSpans() {}

	clean() {}
}

export default AppHtmlParser;
