import type { Facet } from '@atproto/api';
import { TextParser } from './text.js';
import { RandomUtil } from '../utils/index.js';
import { DriverService } from '../services/driver.js';
import { MfmNode } from '../services/index.js';
import { KNOWN_SOFTWARE } from '../client/utils/driver.js';

export type AppTextNodeType =
	| 'para'
	| 'text'
	| 'mention'
	| 'tag'
	| 'customEmoji'
	| 'link'
	| 'inline'
	| 'italic'
	| 'bold'
	| 'code';

export type NodeContentBase = { uuid: string; nodes: NodeContent[] };
// these node types wrap underlying content
export const WrapperNodes: AppTextNodeType[] = [
	'para',
	'italic',
	'bold',
	'inline',
];

export type NodeContentExtended =
	| {
			type: 'para';
	  }
	| {
			type: 'text';
			text: string;
	  }
	| {
			type: 'mention';
			text: string | null;
			url: string | null;
	  }
	| {
			type: 'tag';
			text: string;
	  }
	| {
			type: 'link'; // this text is shortened
			text: string;
			url: string;
	  }
	| {
			type: 'inline';
	  }
	| {
			type: 'bold';
	  }
	| {
			type: 'italic';
	  }
	| {
			type: 'code';
			text: string;
	  }
	| {
			type: 'customEmoji';
			text: string;
			value: string;
	  };

export type NodeContent = NodeContentBase & NodeContentExtended;

export type AppParsedTextNodes = NodeContent[];

export class Builder {
	protected readonly input: string;
	parsed: AppParsedTextNodes;

	links: Map<string, string>;
	mentions: { url?: string; text?: string }[];
	nodes: MfmNode[][];

	constructor({ input }: { input: string }) {
		this.input = input;
		this.parsed = [];

		this.links = new Map();
		this.mentions = [];
		this.nodes = [];
	}

	solve() {
		this.mentions = TextParser.findMentions(this.input);
		this.links = TextParser.findHyperlinks(this.input);
		this.nodes = TextParser.preprocessPostContent(this.input, false);

		this.process();
		return this;
	}

	process() {
		let count = 0;
		let paraCount: number = 0;

		for (const para of this.nodes) {
			this.parsed.push({
				uuid: RandomUtil.nanoId(),
				type: 'para',
				nodes: [],
			});
			for (const node of para) {
				/**
				 * handle text nodes exclusively.
				 * also handles line breaks (<br/>)
				 */
				if (node.type === 'text') {
					const splits = node.props.text.split(/<br ?\/?>/);

					this.parsed[paraCount]!.nodes.push({
						uuid: RandomUtil.nanoId(),
						nodes: [],
						type: 'text',
						text: splits[0] as string,
					});
					count++;

					// each n-1 item results in a split
					for (let i = 1; i < splits.length; i++) {
						this.parsed.push({
							uuid: RandomUtil.nanoId(),
							type: 'para',
							nodes: [],
						});
						paraCount++;

						this.parsed[paraCount]!.nodes.push({
							uuid: RandomUtil.nanoId(),
							type: 'text',
							nodes: [],
							text: splits[i] as string,
						});
					}

					const txt = node.props?.text.trim();
					// @ts-ignore-next-line
					txt.replaceAll(/<br>/g, '\n');
					continue;
				}

				const data = this.parser(node);
				if (data) this.parsed[paraCount]!.nodes.push(data);
				count++;
			}
			paraCount++;
		}
	}

	private parser(node: any): NodeContent | null {
		try {
			switch (node.type) {
				case 'link':
				case 'url': {
					/**
					 * The link/url might be a mention
					 * */
					const mention = this.mentions?.find((o) => o.url === node.props.url);
					if (mention) {
						return {
							type: 'mention',
							uuid: RandomUtil.nanoId(),
							text: mention.text || null,
							url: mention.url || null,
							nodes: [],
						};
					}

					/**
					 * The link/url might be a hashtag
					 */
					const hashtag = TextParser.isHashtag(node.props.url);
					if (hashtag)
						return {
							type: 'tag',
							uuid: RandomUtil.nanoId(),
							text: hashtag,
							nodes: [],
						};

					let displayName = null;
					if (this.links) {
						const match = this.links.get(node.props.url);
						if (match) {
							displayName = match;
						}
					}
					return {
						type: 'link',
						uuid: RandomUtil.nanoId(),
						text: displayName || '',
						url: node.props.url,
						nodes: [],
					};
				}

				case 'plain': {
					return {
						type: 'inline',
						uuid: RandomUtil.nanoId(),
						nodes: node.children
							.map((o: any) => this.parser(o))
							.filter(Boolean),
					};
				}
				case 'italic': {
					return {
						type: 'italic',
						uuid: RandomUtil.nanoId(),
						nodes: node.children
							.map((o: any) => this.parser(o))
							.filter(Boolean),
					};
				}
				case 'bold': {
					return {
						type: 'bold',
						uuid: RandomUtil.nanoId(),
						nodes: node.children
							.map((o: any) => this.parser(o))
							.filter(Boolean),
					};
				}
				// NOTE: node.props.acct is also an option
				case 'mention': {
					const mention = this.mentions?.find((o) => o.url === node.props.url);
					return {
						type: 'mention',
						uuid: RandomUtil.nanoId(),
						text: node.props.acct,
						url: mention?.url || null,
						nodes: [],
					};
				}
				case 'inlineCode':
					return {
						type: 'code',
						uuid: RandomUtil.nanoId(),
						text: node.props.code,
						nodes: [],
					};
				case 'hashtag':
					return {
						type: 'tag',
						text: node.props.hashtag,
						uuid: RandomUtil.nanoId(),
						nodes: [],
					};
				// TODO: quote resolver
				case 'quote':
				case 'text':
					return {
						type: 'text',
						text: node.props.text,
						uuid: RandomUtil.nanoId(),
						nodes: [],
					};
				case 'emojiCode':
					return {
						type: 'customEmoji',
						text: node.props.name,
						value: node.props.name,
						uuid: RandomUtil.nanoId(),
						nodes: [],
					};
				case 'unicodeEmoji':
					return {
						type: 'text',
						text: node.props.emoji,
						uuid: RandomUtil.nanoId(),
						nodes: [],
					};
				default: {
					console.log('[WARN] [MFM]: node not evaluated', node);
					return null;
				}
			}
		} catch (e) {
			// e.g. - quote
			console.log(
				'[WARN] [MFM]: failed to process node',
				node.type,
				node.children,
				node.props,
				e,
			);
			return null;
		}
	}

	decodeUrlString(input: string) {
		try {
			return decodeURI(input);
		} catch (e) {
			console.log('[ERROR]:', e, input);
			return input;
		}
	}
}

class Parser {
	static parse(
		driver: KNOWN_SOFTWARE | string,
		input: string,
		facets?: Facet[],
	): AppParsedTextNodes {
		if (DriverService.supportsAtProto(driver))
			return Parser.withFacets(input, facets || []);
		return Parser.withMfm(input);
	}

	private static toUtf8(input: string): Uint8Array {
		return new TextEncoder().encode(input);
	}

	private static toUtf16(input: Uint8Array): string {
		return new TextDecoder('utf-8').decode(input);
	}

	private static withMfm(input: string): AppParsedTextNodes {
		if (!input) return [];
		return new Builder({
			input,
		}).solve().parsed;
	}

	/**
	 * process the facet nodes, as marked in record
	 * and return app compatible AST
	 * @param input
	 * @param facets
	 */
	private static withFacets(
		input: string,
		facets: Facet[],
	): AppParsedTextNodes {
		if (!input) return [];

		const byteArray: Uint8Array = Parser.toUtf8(input);

		const elements: AppParsedTextNodes = [];
		let idx = 0,
			count = 0;

		elements.push({
			uuid: RandomUtil.nanoId(),
			type: 'para',
			nodes: [],
		});

		for (const facet of facets) {
			// The raw text segments between facet segments
			const prefix = byteArray.slice(idx, facet.index.byteStart);
			elements[0]!.nodes.push({
				uuid: RandomUtil.nanoId(),
				nodes: [],
				type: 'text',
				text: Parser.toUtf16(prefix),
			});
			count++;

			const midSegment = byteArray.slice(
				facet.index.byteStart,
				facet.index.byteEnd,
			);

			// FIXME: not typed
			const _feature = facet.features[0] as any;

			switch (_feature.$type) {
				case 'app.bsky.richtext.facet#mention': {
					elements[0]!.nodes.push({
						type: 'mention',
						uuid: RandomUtil.nanoId(),
						text: Parser.toUtf16(midSegment),
						url: _feature.did,
						nodes: [],
					});
					break;
				}
				case 'app.bsky.richtext.facet#link': {
					elements[0]!.nodes.push({
						type: 'link',
						uuid: RandomUtil.nanoId(),
						text: Parser.toUtf16(midSegment),
						url: _feature.uri,
						nodes: [],
					});
					break;
				}
				case 'app.bsky.richtext.facet#tag': {
					elements[0]!.nodes.push({
						type: 'tag',
						uuid: RandomUtil.nanoId(),
						text: Parser.toUtf16(midSegment),
						nodes: [],
					});
					break;
				}
			}
			count++;
			idx = facet.index.byteEnd;
		}

		// The suffix raw text segment
		const suffix = byteArray.slice(idx);
		elements[0]!.nodes.push({
			uuid: RandomUtil.nanoId(),
			nodes: [],
			type: 'text',
			text: Parser.toUtf16(suffix),
		});
		return elements;
	}
}

export { Parser as TextNodeParser };
