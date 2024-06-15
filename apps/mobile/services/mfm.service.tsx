import {
	MfmNode,
	parseStatusContent,
} from '@dhaaga/shared-utility-html-parser/src';
import { Text } from 'react-native';
import HashtagProcessor from '../components/common/tag/TagProcessor';
import React from 'react';
import { Image } from 'expo-image';
import { EmojiMapValue } from '@dhaaga/shared-abstraction-activitypub/src/adapters/profile/_interface';
import { randomUUID } from 'expo-crypto';
import LinkProcessor from '../components/common/link/LinkProcessor';
import { APP_FONT, APP_THEME } from '../styles/AppTheme';
import { EmojiService } from './emoji.service';
import { MMKV } from 'react-native-mmkv';
import Realm from 'realm';
import MentionProcessor from '../components/common/user/MentionProcessor';

type MentionMap = {
	url: string;
	text: string;
}[];

class MfmService {
	/**
	 * generates a map of mentions from content
	 */
	static findMentions(content: string) {
		const ex = new RegExp('<a.*?href="(.*?)".*?>@(.*?)</a>', 'g');
		const matches = Array.from(content.matchAll(ex));
		return matches.map((o) => ({ url: o[1], text: o[2] }));
	}

	/**
	 * TODO: when parent node is bold/italic,
	 * apply that styling to children, as well
	 * @param node
	 * @param count
	 * @param emojiMap
	 * @param linkMap
	 * @param remoteInstance
	 * @param db
	 * @param globalDb
	 * @param opts
	 * @param mentionMap
	 */
	static parseNode(
		node: MfmNode,
		count: string,
		{
			emojiMap,
			linkMap,
			remoteInstance,
			db,
			globalDb,
			opts,
			mentionMap,
		}: {
			domain: string;
			subdomain: string;
			emojiMap: Map<string, EmojiMapValue>;
			linkMap?: Map<string, string>;
			isHighEmphasisText: boolean;
			db: Realm;
			globalDb: MMKV;
			remoteInstance: string;
			mentionMap: MentionMap;
			opts?: {
				mentionsClickable?: boolean;
				isBold?: boolean;
				isItalic?: boolean;
			};
		},
	) {
		switch (node.type) {
			case 'unicodeEmoji': {
				return <Text key={count}>{node.props.emoji}</Text>;
			}
			case 'text': {
				let baseText = node.props.text;
				baseText = baseText.replaceAll(/<br>/g, '\n');
				return (
					<Text
						key={count}
						style={{
							color: '#fff',
							opacity: 0.87,
						}}
					>
						{baseText}
					</Text>
				);
			}
			case 'hashtag': {
				const hashtagName = this.decodeUrlString(node.props.hashtag);
				return (
					<HashtagProcessor
						key={count}
						forwardedKey={count}
						content={hashtagName}
					/>
				);
			}
			case 'url': {
				const mention = mentionMap?.find((o) => o.url === node.props.url);

				if (mention) {
					return (
						<MentionProcessor
							key={count}
							url={mention.url}
							text={mention.text}
							interactable={false}
						/>
					);
				}

				let displayName = null;
				if (linkMap) {
					const match = linkMap.get(node.props.url);
					if (match) {
						displayName = match;
					}
				}
				return (
					<LinkProcessor
						key={count}
						url={node.props.url}
						displayName={displayName}
					/>
				);
			}
			case 'emojiCode': {
				if (!emojiMap) return <Text key={count}></Text>;
				const match = EmojiService.findCachedEmoji({
					emojiMap,
					db,
					globalDb,
					id: node.props.name,
					remoteInstance,
				});

				if (!match)
					return (
						<Text key={count} style={{ color: APP_THEME.INVALID_ITEM_BODY }}>
							{`:${node.props.name}:`}
						</Text>
					);
				return (
					<Text key={count} style={{ marginTop: 0 }}>
						<Image
							style={{
								width: 18,
								height: 18,
								opacity: 0.87,
							}}
							source={{ uri: match }}
						/>
					</Text>
				);
			}
			case 'italic': {
				const nodes = [];
				for (let i = 0; i < node.children.length; i++) {
					const item = node.children[i];
					if (item.type === 'text') {
						nodes.push(item.props.text);
					} else {
						return (
							<Text
								key={count}
								style={{
									color: APP_FONT.MONTSERRAT_BODY,
									fontStyle: 'italic',
								}}
							>
								Dhaaga: Italics Not Supported
							</Text>
						);
					}
				}
				return (
					<Text key={count}>
						{nodes.map((o, i) => (
							<Text key={i} style={{ fontStyle: 'italic' }}>
								{o}
							</Text>
						))}
					</Text>
				);
			}
			case 'bold': {
				const nodes = [];
				return (
					<Text
						style={{
							fontFamily: 'Inter-Bold',
							color: APP_FONT.MONTSERRAT_BODY,
						}}
					>
						{node.children.map((o, i) =>
							this.parseNode(o, i.toString(), {
								domain: '',
								isHighEmphasisText: false,
								subdomain: '',
								emojiMap,
								linkMap,
								remoteInstance,
								db,
								globalDb,
								opts,
								mentionMap,
							}),
						)}
					</Text>
				);
				// for (let i = 0; i < node.children.length; i++) {
				// 	const item = node.children[i];
				// 	if (item.type === 'text') {
				// 		nodes.push(item.props.text);
				// 	} else {
				// 		return (
				// 			<Text
				// 				key={count}
				// 				style={{
				// 					color: APP_FONT.MONTSERRAT_BODY,
				// 					fontStyle: 'italic',
				// 				}}
				// 			>
				// 				Dhaaga: Italics Not Supported
				// 			</Text>
				// 		);
				// 	}
				// }
				return (
					<Text>
						{nodes.map((o, i) => (
							<Text key={i} style={{ fontStyle: 'italic' }}>
								{o}
							</Text>
						))}
					</Text>
				);
			}
			case 'mention': {
				return (
					<MentionProcessor
						url={node.props.acct}
						text={node.props.username}
						interactable={false}
					/>
				);
				// return <Text key={count}>{node.props.acct}</Text>;
			}
			default: {
				console.log('[WARN]: node type not evaluated', node);
				return <Text key={count}></Text>;
			}
		}
	}

	static decodeUrlString(input: string) {
		return decodeURI(input);
	}

	private static extractUrls(item: string) {
		const mp = new Map<string, string>();
		const ex = /<a.*?href="(.*?)".*?>(.*?)<\/a>/gu;

		const aRefContentCleanupRegex = /(<([^>]+)>)/gi;

		const matches = item.matchAll(ex);
		for (const match of matches) {
			const result = match[2].replace(aRefContentCleanupRegex, '');
			mp.set(match[1], result);
		}
		return mp;
	}

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
			domain?: string;
			subdomain?: string;
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
		if (!input || !domain || !subdomain || !emojiMap)
			return {
				reactNodes: [],
				openAiContext: [],
			};

		// console.log(input);
		const mentionMap = this.findMentions(input);

		const extractedUrls = this.extractUrls(input);

		const parsed = parseStatusContent(input);
		// console.log(input);
		// console.log(parsed);
		let retval = [];
		let openAiContext = [];
		let count = 0;
		let paraCount = 0;

		/**
		 * Ensure remote emojis are resolved
		 */
		const emojiCodes = new Set<string>();
		for (const para of parsed) {
			for (const node of para) {
				if (node.type === 'emojiCode') {
					emojiCodes.add(node.props.name);
				}
			}
		}
		if (emojiCodes.size > 0) {
			EmojiService.loadEmojisForInstanceSync(db, globalDb, remoteSubdomain, {
				selection: emojiCodes,
			});
		}

		for (const para of parsed) {
			retval.push([]);
			for (const node of para) {
				// handle line breaks
				if (node.type === 'text') {
					const splits = node.props.text.split(/<br ?\/?>/);

					const key = randomUUID();
					// first item is always text
					retval[paraCount].push(
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
						retval.push([]);
						paraCount++;

						const key = randomUUID();
						retval[paraCount].push(
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
					txt.replaceAll(/<br>/g, '\n');
					openAiContext.push(txt);
					continue;
				}

				const key = randomUUID();
				const item = MfmService.parseNode(node, key, {
					emojiMap: emojiMap,
					linkMap: extractedUrls,
					domain,
					subdomain,
					isHighEmphasisText: false,
					db,
					globalDb,
					remoteInstance: remoteSubdomain,
					mentionMap,
				});

				retval[paraCount].push(item);
				count++;
			}
			paraCount++;
		}

		return {
			reactNodes: retval,
			openAiContext,
		};
	}
}

export default MfmService;
