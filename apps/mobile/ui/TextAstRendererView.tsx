import { StyleProp, Text, View, ViewStyle } from 'react-native';
import RawTextSegment from '../components/shared/mfm/RawTextSegment';
import { TEXT_PARSING_VARIANT } from '#/types/app.types';
import { APP_FONTS } from '#/styles/AppFonts';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import HashtagSegment from '../components/shared/mfm/HashtagSegment';
import { appDimensions } from '#/styles/dimensions';
import MentionSegment from '../components/shared/mfm/MentionSegment';
import { TextParser } from '@dhaaga/bridge';
import type { NodeContent, AppParsedTextNodes } from '@dhaaga/bridge';
import LinkSegment from '../components/shared/mfm/LinkSegment';
import EmojiCodeSegment from '../components/shared/mfm/EmojiCodeSegment';
import type { PostMentionObjectType } from '@dhaaga/bridge';

type NodeProps = {
	node: NodeContent;
	variant: TEXT_PARSING_VARIANT;
	mentions: PostMentionObjectType[];
	emojiMap: Map<string, string>;
	oneLine?: boolean;
};

function ParsedNode({ node, variant, mentions, emojiMap, oneLine }: NodeProps) {
	if (!node) return <View />;

	if (
		node.type !== 'para' &&
		node.type !== 'bold' &&
		node.type !== 'italic' &&
		node.type !== 'inline'
	) {
		switch (node.type) {
			case 'text': {
				return <RawTextSegment value={node.text} variant={variant} />;
			}
			case 'mention': {
				if (variant === 'displayName') {
					return <RawTextSegment value={node.text} variant={variant} />;
				}
				return (
					<MentionSegment
						value={node.text}
						link={node.url}
						mentions={mentions}
						fontFamily={APP_FONTS.ROBOTO_500}
					/>
				);
			}
			case 'customEmoji': {
				return (
					<EmojiCodeSegment
						value={node.text}
						emojiMap={emojiMap}
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
						fontFamily={APP_FONTS.INTER_500_MEDIUM}
					/>
				);
			}
			case 'tag': {
				return <HashtagSegment value={node.text} />;
			}
			case 'link': {
				// const mention = mentions.find((o) => o.url === node.url);
				//
				// if (mention) {
				// 	return (
				// 		<MentionSegment
				// 			key={node.uuid}
				// 			value={mention.text}
				// 			link={mention.url}
				// 			fontFamily={
				// 				variant === 'displayName'
				// 					? APP_FONTS.INTER_600_SEMIBOLD
				// 					: APP_FONTS.ROBOTO_400
				// 			}
				// 			mentions={mentions}
				// 		/>
				// 	);
				// }

				const isHashtag = TextParser.isHashtag(node.url);
				if (isHashtag) {
					return <HashtagSegment value={node.text} />;
				}

				return <LinkSegment url={node.url} displayName={node.text} />;
			}
			default:
				return <View />;
		}
	}

	switch (node.type) {
		case 'para': {
			return (
				<Text
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
						<ParsedNode
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
						<ParsedNode
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

type TextAstRendererViewProps = {
	tree: AppParsedTextNodes;
	variant: TEXT_PARSING_VARIANT;
	mentions: PostMentionObjectType[];
	emojiMap: Map<string, string>;
	style?: StyleProp<ViewStyle>;
	oneLine?: boolean;
};

function TextAstRendererView({
	tree,
	style,
	variant,
	mentions,
	emojiMap,
	oneLine,
}: TextAstRendererViewProps) {
	if (!Array.isArray(tree)) return <View />;
	return (
		<View style={style}>
			{tree.map((item, i) => (
				<ParsedNode
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

export default TextAstRendererView;
