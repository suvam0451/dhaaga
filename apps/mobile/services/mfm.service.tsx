import { Text } from 'react-native';
import LinkProcessor from '../components/common/link/LinkProcessor';
import { TextParserService } from './text-parser.service';
import type { MfmNode } from '@dhaaga/bridge';
import InlineCodeSegment from '../components/shared/mfm/InlineCodeSegment';
import MentionSegment from '../components/shared/mfm/MentionSegment';
import EmojiCodeSegment from '../components/shared/mfm/EmojiCodeSegment';
import HashtagSegment from '../components/shared/mfm/HashtagSegment';
import RawTextSegment from '../components/shared/mfm/RawTextSegment';
import { APP_FONTS } from '../styles/AppFonts';
import { RandomUtil } from '../utils/random.utils';
import {
	APP_COLOR_PALETTE_EMPHASIS,
	AppColorSchemeType,
	AppThemingUtil,
} from '../utils/theming.util';
import { AppText } from '../components/lib/Text';
import { TEXT_PARSING_VARIANT } from '../types/app.types';
import { AppParsedTextNodes, NodeContent } from '../types/parsed-text.types';

export class MfmComponentBuilder {
	protected readonly input: string;
	protected readonly myDomain: string;
	protected readonly mySubdomain: string;
	protected readonly emojiMap?: Map<string, string>;

	// settings
	protected parseMentions: boolean = true;
	protected parseLinks: boolean = true;

	links: Map<string, string>;
	mentions: { url: string; text: string }[];
	nodes: MfmNode[][];
	emojis: Set<string>;
	targetSubdomain?: string;
	emphasis: APP_COLOR_PALETTE_EMPHASIS;
	results: any[];
	aiContext: any[];

	fontFamily: string;
	colorScheme: AppColorSchemeType;
	nonInteractive?: boolean;
	variant: TEXT_PARSING_VARIANT;
	parsed: AppParsedTextNodes;

	constructor({
		input,
		emojiMap,
		fontFamily,
		emphasis,
		colorScheme,
		nonInteractive,
		variant,
	}: {
		input: string;
		emojiMap?: Map<string, string>;
		fontFamily: string;
		emphasis: APP_COLOR_PALETTE_EMPHASIS;
		colorScheme: AppColorSchemeType;
		nonInteractive?: boolean;
		variant: TEXT_PARSING_VARIANT;
	}) {
		this.input = input;
		this.emojis = new Set<string>();
		this.results = [];
		this.aiContext = [];
		this.emojiMap = emojiMap;
		this.fontFamily = fontFamily;
		this.emphasis = emphasis;
		this.colorScheme = colorScheme;
		this.nonInteractive = nonInteractive;
		this.variant = variant;
		this.parsed = [];
	}

	solve() {
		this.mentions = TextParserService.findMentions(this.input);
		this.links = TextParserService.findHyperlinks(this.input);
		this.nodes = TextParserService.preprocessPostContent(this.input, false);

		this.findEmojis();
		this.process();
	}

	findEmojis() {
		for (const para of this.nodes) {
			for (const node of para) {
				if (node.type === 'emojiCode') {
					this.emojis.add(node.props.name);
					continue;
				}
				if (['bold', 'italic'].includes(node.type)) {
					for (let i = 0; i < node.children.length; i++) {
						const child = node.children[i];
						if (child.type === 'emojiCode') {
							console.log(child.props.name);
							this.emojis.add(child.props.name);
						} else {
							console.log(child.type);
						}
					}
				}
			}
		}
	}

	process() {
		let count = 0;
		let paraCount = 0;

		for (const para of this.nodes) {
			this.results.push([]);
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
					const splits = node.props?.text.split(/<br ?\/?>/);

					switch (this.variant) {
						case 'displayName': {
							// first item is always text
							this.results[paraCount].push(
								<AppText.SemiBold emphasis={this.emphasis} keygen>
									{splits[0]}
								</AppText.SemiBold>,
							);
							break;
						}
						case 'bodyContent': {
							// first item is always text
							this.results[paraCount].push(
								<AppText.BodyNormal emphasis={this.emphasis} keygen>
									{splits[0]}
								</AppText.BodyNormal>,
							);
						}
					}

					this.parsed[paraCount].nodes.push({
						uuid: RandomUtil.nanoId(),
						nodes: [],
						type: 'text',
						text: splits[0],
					});
					count++;

					// each n-1 item results in a split
					for (let i = 1; i < splits.length; i++) {
						this.results.push([]);
						this.parsed.push({
							uuid: RandomUtil.nanoId(),
							type: 'para',
							nodes: [],
						});
						paraCount++;

						this.parsed[paraCount].nodes.push({
							uuid: RandomUtil.nanoId(),
							type: 'text',
							nodes: [],
							text: splits[i],
						});
						this.results[paraCount].push(
							<AppText.BodyNormal keygen>{splits[i]}</AppText.BodyNormal>,
						);
					}

					const txt = node.props?.text.trim();
					// @ts-ignore-next-line
					txt.replaceAll(/<br>/g, '\n');
					this.aiContext.push(txt);
					continue;
				}

				const [Component, data] = this.parser(node);
				this.results[paraCount].push(Component);
				this.parsed[paraCount].nodes.push(data);
				count++;
			}
			paraCount++;
		}
	}

	private parser(node: any): [React.JSX.Element, NodeContent] {
		let color = AppThemingUtil.getColorForEmphasis(
			this.colorScheme?.secondary,
			this.emphasis,
		);

		const k = RandomUtil.nanoId();
		switch (node.type) {
			case 'link':
			case 'url': {
				/**
				 * The link/url might be a mention
				 * */
				const mention = this.mentions?.find((o) => o.url === node.props.url);
				if (mention) {
					return [
						<MentionSegment
							key={k}
							value={mention.text}
							link={mention.url}
							fontFamily={this.fontFamily}
						/>,
						{
							type: 'mention',
							uuid: RandomUtil.nanoId(),
							text: mention.text,
							url: mention.url,
							nodes: [],
						},
					];
				}

				/**
				 * The link/url might be a hashtag
				 */
				const hashtag = TextParserService.isHashtag(node.props.url);
				if (hashtag)
					return [
						<HashtagSegment
							key={k}
							value={hashtag}
							fontFamily={this.fontFamily}
						/>,
						{
							type: 'tag',
							uuid: RandomUtil.nanoId(),
							text: hashtag,
							nodes: [],
						},
					];

				let displayName = null;
				if (this.links) {
					const match = this.links.get(node.props.url);
					if (match) {
						displayName = match;
					}
				}
				return [
					<LinkProcessor
						key={k}
						url={node.props.url}
						displayName={displayName}
						fontFamily={this.fontFamily}
						emphasis={this.emphasis}
					/>,
					{
						type: 'link',
						uuid: RandomUtil.nanoId(),
						text: displayName,
						url: node.props.url,
						nodes: [],
					},
				];
			}

			case 'plain': {
				return [
					<Text
						key={k}
						style={{
							color: color as any,
							fontFamily: 'SourceSansPro_400Regular',
						}}
					>
						{node.children.map((o: any) => this.parser(o))}
					</Text>,
					{
						type: 'inline',
						uuid: RandomUtil.nanoId(),
						nodes: node.children.map((o: any) => this.parser(o)),
					},
				];
			}
			case 'italic': {
				return [
					<Text
						key={k}
						style={{
							fontStyle: 'italic',
							color: color as any,
						}}
					>
						{node.children.map((o: any) => this.parser(o))}
					</Text>,
					{
						type: 'italic',
						uuid: RandomUtil.nanoId(),
						nodes: node.children.map((o: any) => this.parser(o)),
					},
				];
			}
			case 'bold': {
				return [
					<Text
						key={k}
						style={{
							fontFamily: this.fontFamily,
							color: color as any,
						}}
					>
						{node.children.map((o: any) => this.parser(o))}
					</Text>,
					{
						type: 'bold',
						uuid: RandomUtil.nanoId(),
						nodes: node.children.map((o: any) => this.parser(o)),
					},
				];
			}
			// NOTE: node.props.acct is also an option
			case 'mention': {
				const mention = this.mentions?.find((o) => o.url === node.props.url);
				return [
					<MentionSegment
						key={k}
						value={node.props.acct}
						link={mention?.url}
						fontFamily={this.fontFamily}
					/>,
					{
						type: 'mention',
						uuid: RandomUtil.nanoId(),
						text: node.props.acct,
						url: mention?.url,
						nodes: [],
					},
				];
			}
			case 'inlineCode':
				return [
					<InlineCodeSegment key={k} value={node.props.code} />,
					{
						type: 'code',
						uuid: RandomUtil.nanoId(),
						text: node.props.code,
						nodes: [],
					},
				];
			case 'hashtag':
				return [
					<HashtagSegment
						key={k}
						value={node.props.hashtag}
						fontFamily={this.fontFamily}
					/>,
					{
						type: 'tag',
						text: node.props.hashtag,
						uuid: RandomUtil.nanoId(),
						nodes: [],
					},
				];
			// TODO: quote resolver
			case 'quote':
			case 'text':
				return [
					<RawTextSegment
						key={k}
						value={node.props?.text}
						fontFamily={this.fontFamily}
						emphasis={this.emphasis}
					/>,
					{
						type: 'text',
						text: node.props.emoji,
						uuid: RandomUtil.nanoId(),
						nodes: [],
					},
				];
			case 'emojiCode':
				return [
					<EmojiCodeSegment
						key={k}
						value={node.props.name}
						emojiMap={this.emojiMap}
						emphasis={this.emphasis}
						fontFamily={this.fontFamily}
					/>,
					{
						type: 'customEmoji',
						text: node.props.emoji,
						value: node.props.emoji,
						uuid: RandomUtil.nanoId(),
						nodes: [],
					},
				];
			case 'unicodeEmoji':
				return [
					<Text key={k}>{node.props.emoji}</Text>,
					{
						type: 'text',
						text: node.props.emoji,
						uuid: RandomUtil.nanoId(),
						nodes: [],
					},
				];
			default: {
				console.log('[WARN]: node type not evaluated', node);
				return [<Text key={k}></Text>, null];
			}
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

class MfmService {
	/**
	 *
	 * @param input
	 * @param emojiMap
	 * @param domain
	 * @param emphasis
	 * @param nonInteractive
	 */
	static renderMfm(
		input: string,
		{
			emojiMap,
			emphasis,
			colorScheme,
			variant,
			nonInteractive,
		}: {
			emojiMap: Map<string, string>;
			emphasis: APP_COLOR_PALETTE_EMPHASIS;
			colorScheme: AppColorSchemeType;
			variant: TEXT_PARSING_VARIANT;
			nonInteractive?: boolean;
		},
	) {
		if (!input || !emojiMap)
			return {
				reactNodes: [],
				openAiContext: [],
			};

		const solver = new MfmComponentBuilder({
			input,
			emojiMap,
			fontFamily:
				variant === 'displayName'
					? APP_FONTS.INTER_600_SEMIBOLD
					: APP_FONTS.INTER_400_REGULAR,
			emphasis: emphasis || APP_COLOR_PALETTE_EMPHASIS.A0,
			colorScheme,
			nonInteractive,
			variant,
		});
		solver.solve();
		return {
			reactNodes: solver.results,
			openAiContext: solver.aiContext,
			parsed: solver.parsed,
		};
	}
}

export default MfmService;
