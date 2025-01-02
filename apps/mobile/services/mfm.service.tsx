import { StyleProp, Text, TextStyle } from 'react-native';
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

class MfmComponentBuilder {
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

	constructor({
		input,
		targetSubdomain,
		emojiMap,
		opts,
		fontFamily,
		emphasis,
		colorScheme,
		style,
	}: {
		input: string;
		targetSubdomain?: string;
		emojiMap?: Map<string, string>;
		opts?: {
			parseMentions?: boolean;
			parseLinks?: boolean;
		};
		fontFamily?: string;
		emphasis: APP_COLOR_PALETTE_EMPHASIS;
		colorScheme: AppColorSchemeType;
		style?: StyleProp<TextStyle>;
	}) {
		this.input = input;
		this.emojis = new Set<string>();
		this.targetSubdomain = targetSubdomain;
		this.results = [];
		this.aiContext = [];
		this.emojiMap = emojiMap;
		this.fontFamily = fontFamily || APP_FONTS.INTER_400_REGULAR;
		this.emphasis = emphasis;
		this.colorScheme = colorScheme;

		// options
		if (opts?.parseMentions !== undefined)
			this.parseMentions = opts?.parseMentions;
		if (opts?.parseLinks !== undefined) this.parseLinks = opts?.parseLinks;
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
			for (const node of para) {
				// handle line breaks
				if (node.type === 'text') {
					const splits = node.props?.text.split(/<br ?\/?>/);

					// first item is always text
					this.results[paraCount].push(
						<AppText.BodyNormal keygen>{splits[0]}</AppText.BodyNormal>,
					);
					count++;

					// each n-1 item results in a split
					for (let i = 1; i < splits.length; i++) {
						this.results.push([]);
						paraCount++;

						this.results[paraCount].push(
							<AppText.BodyNormal keygen>{splits[1]}</AppText.BodyNormal>,
						);
					}

					const txt = node.props?.text.trim();
					// @ts-ignore-next-line
					txt.replaceAll(/<br>/g, '\n');
					this.aiContext.push(txt);
					continue;
				}

				const item = this.parser(node);
				this.results[paraCount].push(item);
				count++;
			}
			paraCount++;
		}
	}

	private parser(node: any) {
		let color = AppThemingUtil.getColorForEmphasis(
			this.colorScheme.secondary,
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
					return (
						<MentionSegment
							key={k}
							value={mention.text}
							link={mention.url}
							fontFamily={this.fontFamily}
						/>
					);
				}

				/**
				 * The link/url might be a hashtag
				 */
				const hashtag = TextParserService.isHashtag(node.props.url);
				if (hashtag)
					return (
						<HashtagSegment
							key={k}
							value={hashtag}
							fontFamily={this.fontFamily}
						/>
					);

				let displayName = null;
				if (this.links) {
					const match = this.links.get(node.props.url);
					if (match) {
						displayName = match;
					}
				}
				return (
					<LinkProcessor
						key={k}
						url={node.props.url}
						displayName={displayName}
						fontFamily={this.fontFamily}
						emphasis={this.emphasis}
					/>
				);
			}

			case 'plain': {
				return (
					<Text
						key={k}
						style={{
							color: color as any,
							fontFamily: 'SourceSansPro_400Regular',
						}}
					>
						{node.children.map((o: any) => this.parser(o))}
					</Text>
				);
			}
			case 'italic': {
				return (
					<Text
						key={k}
						style={{
							fontStyle: 'italic',
							color: color as any,
						}}
					>
						{node.children.map((o: any) => this.parser(o))}
					</Text>
				);
			}
			case 'bold': {
				return (
					<Text
						key={k}
						style={{
							fontFamily: this.fontFamily,
							color: color as any,
						}}
					>
						{node.children.map((o: any) => this.parser(o))}
					</Text>
				);
			}
			// NOTE: node.props.acct is also an option
			case 'mention': {
				const mention = this.mentions?.find((o) => o.url === node.props.url);
				return (
					<MentionSegment
						key={k}
						value={node.props.acct}
						link={mention?.url}
						fontFamily={this.fontFamily}
					/>
				);
			}
			case 'inlineCode':
				return <InlineCodeSegment key={k} value={node.props.code} />;
			case 'hashtag':
				return (
					<HashtagSegment
						key={k}
						value={node.props.hashtag}
						fontFamily={this.fontFamily}
					/>
				);
			// TODO: quote resolver
			case 'quote':
			case 'text':
				return (
					<RawTextSegment
						key={k}
						value={node.props?.text}
						fontFamily={this.fontFamily}
						emphasis={this.emphasis}
					/>
				);
			case 'emojiCode':
				return (
					<EmojiCodeSegment
						key={k}
						value={node.props.name}
						remoteInstance={this.targetSubdomain}
						emojiMap={this.emojiMap}
						emphasis={this.emphasis}
						fontFamily={this.fontFamily}
					/>
				);
			case 'unicodeEmoji':
				return <Text key={k}>{node.props.emoji}</Text>;

			default: {
				console.log('[WARN]: node type not evaluated', node);
				return <Text key={k}></Text>;
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
	 * @param subdomain
	 * @param db
	 * @param remoteSubdomain is the subdomain of target user
	 * @param emphasis
	 * @param fontFamily
	 */
	static renderMfm(
		input: string,
		{
			emojiMap,
			subdomain,
			remoteSubdomain,
			fontFamily,
			emphasis,
			colorScheme,
			style,
		}: {
			subdomain: string;
			emojiMap: Map<string, string>;
			remoteSubdomain?: string;
			fontFamily?: string;
			emphasis?: APP_COLOR_PALETTE_EMPHASIS;
			opts?: {
				mentionsClickable?: boolean;
				fontFamily?: string;
			};
			colorScheme: AppColorSchemeType;
			style?: StyleProp<TextStyle>;
		},
	) {
		/**
		 * Misskey hack.
		 *
		 * When user belongs to same instance, host = null
		 */
		if (!remoteSubdomain && subdomain) remoteSubdomain = subdomain;

		if (!input || !emojiMap)
			return {
				reactNodes: [],
				openAiContext: [],
			};

		const solver = new MfmComponentBuilder({
			input,
			emojiMap,
			targetSubdomain: remoteSubdomain,
			fontFamily: fontFamily || APP_FONTS.INTER_400_REGULAR,
			emphasis: emphasis || APP_COLOR_PALETTE_EMPHASIS.A0,
			colorScheme,
			style,
		});
		solver.solve();
		return {
			reactNodes: solver.results,
			openAiContext: solver.aiContext,
		};
	}
}

export default MfmService;
