import { Text } from 'react-native';
import { EmojiMapValue } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/profile/_interface';
import { randomUUID } from 'expo-crypto';
import LinkProcessor from '../components/common/link/LinkProcessor';
import { APP_FONT } from '../styles/AppTheme';
import { EmojiService } from './emoji.service';
import { MMKV } from 'react-native-mmkv';
import { Realm } from 'realm';
import TextParserService from './text-parser';
import type { MfmNode } from '@dhaaga/shared-abstraction-activitypub';
import InlineCodeSegment from '../components/shared/mfm/InlineCodeSegment';
import MentionSegment from '../components/shared/mfm/MentionSegment';
import EmojiCodeSegment from '../components/shared/mfm/EmojiCodeSegment';
import HashtagSegment from '../components/shared/mfm/HashtagSegment';
import RawTextSegment from '../components/shared/mfm/RawTextSegment';

class MfmComponentBuilder {
	protected readonly input: string;
	protected readonly db: Realm;
	protected readonly globalDb: MMKV;
	protected readonly myDomain: string;
	protected readonly mySubdomain: string;
	protected readonly emojiMap?: Map<string, EmojiMapValue>;

	// settings
	protected parseMentions: boolean = true;
	protected parseLinks: boolean = true;

	links: Map<string, string>;
	mentions: { url: string; text: string }[];
	nodes: MfmNode[][];
	emojis: Set<string>;
	targetSubdomain?: string;

	results: any[];
	aiContext: any[];

	constructor({
		input,
		db,
		globalDb,
		targetSubdomain,
		mySubdomain,
		myDomain,
		emojiMap,
		opts,
	}: {
		input: string;
		db: Realm;
		globalDb: MMKV;
		myDomain: string;
		mySubdomain: string;
		targetSubdomain?: string;
		emojiMap?: Map<string, EmojiMapValue>;
		opts?: {
			parseMentions?: boolean;
			parseLinks?: boolean;
		};
	}) {
		this.input = input;
		this.db = db;
		this.globalDb = globalDb;
		this.emojis = new Set<string>();
		this.targetSubdomain = targetSubdomain;
		this.results = [];
		this.aiContext = [];
		this.mySubdomain = mySubdomain;
		this.myDomain = myDomain;
		this.emojiMap = emojiMap;

		// options
		if (opts?.parseMentions !== undefined)
			this.parseMentions = opts?.parseMentions;
		if (opts?.parseLinks !== undefined) this.parseLinks = opts?.parseLinks;
	}

	solve(perf: boolean) {
		this.findMentions();
		this.findLinks();

		this.preprocess();

		this.findEmojis();
		this.loadEmojis();

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
					// console.log('detected bold/italic', node.children);
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

	loadEmojis() {
		if (this.emojis.size === 0) return;
		EmojiService.loadEmojisForInstanceSync(
			this.db,
			this.globalDb,
			this.targetSubdomain,
			{
				selection: this.emojis,
			},
		);
	}

	preprocess() {
		this.nodes = TextParserService.preprocessPostContent(this.input, false);
	}

	findLinks() {
		this.links = TextParserService.findHyperlinks(this.input);
	}

	findMentions() {
		this.mentions = TextParserService.findMentions(this.input);
	}

	process() {
		let count = 0;
		let paraCount = 0;

		for (const para of this.nodes) {
			this.results.push([]);
			for (const node of para) {
				// handle line breaks
				if (node.type === 'text') {
					const splits = node.props.text.split(/<br ?\/?>/);

					const key = randomUUID();
					// first item is always text
					this.results[paraCount].push(
						<Text
							key={key}
							style={{
								color: APP_FONT.MONTSERRAT_BODY,
							}}
						>
							{splits[0]}
						</Text>,
					);
					count++;

					// each n-1 item results in a split
					for (let i = 1; i < splits.length; i++) {
						this.results.push([]);
						paraCount++;

						const key = randomUUID();
						this.results[paraCount].push(
							<Text
								key={key}
								style={{
									color: 'rgba(255, 255, 255, 0.6)',
								}}
							>
								{splits[i]}
							</Text>,
						);
					}

					const txt = node.props.text.trim();
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
		const k = randomUUID();
		switch (node.type) {
			case 'link':
			case 'url': {
				const mention = this.mentions?.find((o) => o.url === node.props.url);

				// NOTE: mention.url is also an option
				if (mention) return <MentionSegment value={mention.text} />;

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
					/>
				);
			}

			case 'plain': {
				return (
					<Text
						key={k}
						style={{
							color: APP_FONT.MONTSERRAT_BODY,
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
							color: APP_FONT.MONTSERRAT_BODY,
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
							fontFamily: 'Inter-Bold',
							color: APP_FONT.MONTSERRAT_HEADER,
						}}
					>
						{node.children.map((o: any) => this.parser(o))}
					</Text>
				);
			}
			// NOTE: node.props.acct is also an option
			case 'mention':
				return <MentionSegment key={k} value={node.props.username} />;
			case 'inlineCode':
				return <InlineCodeSegment key={k} value={node.props.code} />;
			case 'hashtag':
				return <HashtagSegment key={k} value={node.props.hashtag} />;
			case 'text':
				return <RawTextSegment key={k} value={node.props.text} />;
			case 'emojiCode':
				return (
					<EmojiCodeSegment
						key={k}
						value={node.props.name}
						remoteInstance={this.targetSubdomain}
						emojiMap={this.emojiMap}
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
	 * @param globalDb
	 * @param remoteSubdomain is the subdomain of target user
	 * @param opts
	 */
	static renderMfm(
		input: string,
		{
			emojiMap,
			domain,
			subdomain,
			db,
			globalDb,
			remoteSubdomain,
			opts,
		}: {
			domain: string;
			subdomain: string;
			emojiMap: Map<string, EmojiMapValue>;
			globalDb: MMKV;
			db: Realm;
			remoteSubdomain?: string;
			opts?: {
				mentionsClickable?: boolean;
				fontFamily?: string;
			};
		},
	) {
		/**
		 * Misskey hack.
		 *
		 * When user belongs to same instance, host = null
		 */
		if (!remoteSubdomain && subdomain) {
			remoteSubdomain = subdomain;
		}
		if (!input || !domain || !subdomain || !emojiMap)
			return {
				reactNodes: [],
				openAiContext: [],
			};

		const solver = new MfmComponentBuilder({
			input,
			db,
			globalDb,
			myDomain: domain,
			mySubdomain: subdomain,
			emojiMap,
			targetSubdomain: remoteSubdomain,
		});
		solver.solve(true);
		return {
			reactNodes: solver.results,
			openAiContext: solver.aiContext,
		};
	}
}

export default MfmService;
