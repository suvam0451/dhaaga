import {
	AppParsedTextNodes,
	NodeContent,
	WrapperNode,
} from '../../../../types/parsed-text.types';
import { StyleProp, Text, View, ViewStyle } from 'react-native';
import RawTextSegment from '../../../shared/mfm/RawTextSegment';
import { TEXT_PARSING_VARIANT } from '../../../../types/app.types';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../../utils/theming.util';
import HashtagSegment from '../../../shared/mfm/HashtagSegment';
import { appDimensions } from '../../../../styles/dimensions';
import MentionSegment from '../../../shared/mfm/MentionSegment';
import { TextParserService } from '../../../../services/text-parser.service';
import LinkProcessor from '../../link/LinkProcessor';
import EmojiCodeSegment from '../../../shared/mfm/EmojiCodeSegment';

type TextContentNodeProps = {
	node: NodeContent;
	variant: TEXT_PARSING_VARIANT;
	mentions: { url: string; text: string; resolved: boolean }[];
	emojiMap: Map<string, string>;
	oneLine?: boolean;
};

function TextContentNode({
	node,
	variant,
	mentions,
	emojiMap,
	oneLine,
}: TextContentNodeProps) {
	if (!node) return <View />;

	if (!WrapperNode.includes(node.type)) {
		switch (node.type) {
			case 'text': {
				return (
					<RawTextSegment
						key={node.uuid}
						value={node.text}
						fontFamily={
							variant === 'displayName'
								? APP_FONTS.INTER_600_SEMIBOLD
								: APP_FONTS.ROBOTO_400
						}
						emphasis={
							variant === 'displayName'
								? APP_COLOR_PALETTE_EMPHASIS.A0
								: APP_COLOR_PALETTE_EMPHASIS.A10
						}
					/>
				);
			}
			case 'mention': {
				if (variant === 'displayName') {
					return (
						<RawTextSegment
							key={node.uuid}
							value={node.text}
							fontFamily={
								variant === 'displayName'
									? APP_FONTS.INTER_600_SEMIBOLD
									: APP_FONTS.ROBOTO_400
							}
							emphasis={
								variant === 'displayName'
									? APP_COLOR_PALETTE_EMPHASIS.A0
									: APP_COLOR_PALETTE_EMPHASIS.A10
							}
						/>
					);
				}
				return (
					<MentionSegment
						key={node.uuid}
						value={node.text}
						link={node.url}
						fontFamily={APP_FONTS.INTER_500_MEDIUM}
					/>
				);
			}
			case 'customEmoji': {
				return (
					<EmojiCodeSegment
						key={node.uuid}
						value={node.text}
						emojiMap={emojiMap}
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
						fontFamily={APP_FONTS.INTER_500_MEDIUM}
					/>
				);
			}
			case 'tag': {
				return (
					<HashtagSegment
						key={node.uuid}
						value={node.text}
						fontFamily={
							variant === 'displayName'
								? APP_FONTS.INTER_600_SEMIBOLD
								: APP_FONTS.ROBOTO_500
						}
					/>
				);
			}
			case 'link': {
				const mention = mentions.find((o) => o.url === node.url);

				if (mention) {
					return (
						<MentionSegment
							key={node.uuid}
							value={mention.text}
							link={mention.url}
							fontFamily={
								variant === 'displayName'
									? APP_FONTS.INTER_600_SEMIBOLD
									: APP_FONTS.ROBOTO_500
							}
						/>
					);
				}

				const isHashtag = TextParserService.isHashtag(node.url);
				if (isHashtag) {
					return (
						<HashtagSegment
							key={node.uuid}
							value={node.text}
							fontFamily={
								variant === 'displayName'
									? APP_FONTS.INTER_600_SEMIBOLD
									: APP_FONTS.ROBOTO_500
							}
						/>
					);
				}

				return (
					<LinkProcessor
						key={node.uuid}
						url={node.url}
						displayName={node.text}
						fontFamily={
							variant === 'displayName'
								? APP_FONTS.INTER_600_SEMIBOLD
								: APP_FONTS.ROBOTO_500
						}
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
					/>
				);
			}
			default:
				return <View />;
		}
	}

	switch (node.type) {
		case 'para': {
			return (
				<Text
					key={node.uuid}
					style={{
						marginBottom:
							variant === 'displayName'
								? 0
								: appDimensions.timelines.sectionBottomMargin * 0.5,
						flexDirection: 'row',
						alignItems: 'center',
					}}
					numberOfLines={oneLine ? 1 : undefined}
				>
					{node.nodes.map((_node, i) => (
						<TextContentNode
							key={i}
							mentions={mentions}
							node={_node}
							variant={variant}
							emojiMap={emojiMap}
						/>
					))}
				</Text>
			);
		}
		case 'italic':
		case 'bold': {
			return (
				<Text key={node.uuid}>
					{node.nodes.map((_node, i) => (
						<TextContentNode
							key={i}
							mentions={mentions}
							node={_node}
							variant={variant}
							emojiMap={emojiMap}
						/>
					))}
				</Text>
			);
		}
	}
}

type TextContentViewProps = {
	tree: AppParsedTextNodes;
	variant: TEXT_PARSING_VARIANT;
	mentions: { url: string; text: string; resolved: boolean }[];
	emojiMap: Map<string, string>;
	style?: StyleProp<ViewStyle>;
	oneLine?: boolean;
};

export function TextContentView({
	tree,
	style,
	variant,
	mentions,
	emojiMap,
	oneLine,
}: TextContentViewProps) {
	if (!Array.isArray(tree)) return <View />;
	return (
		<View style={style}>
			{/* --- paragraphs --- */}
			{tree.map((item, i) => (
				<TextContentNode
					key={i}
					node={item}
					variant={variant}
					mentions={mentions}
					emojiMap={emojiMap}
					oneLine={oneLine}
				/>
			))}
		</View>
	);
}
