/**
 * Additional service provided
 * by dhaagajs
 */
export interface ParserRoute {
	/**
	 * Stop after pre-processing
	 * input string
	 * @param input
	 */
	processHtml(input: string): string;

	/**
	 * Pre-process and parse
	 * the input string
	 *
	 * lib used -> misskey-js -- 2024.5.0
	 * @param input raw status content
	 * @param parser is unused
	 */
	parseMfm(input: string, parser?: 'misskey'): string;

	/**
	 * Captures a list of links and mentions
	 * from status content
	 * @param input the raw status html content
	 */
	parseLinks(input: string): string[];
}
