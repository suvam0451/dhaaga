import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import ExplainOutput from '../explanation/ExplainOutput';
import MediaItem from '../media/MediaItem';
import useMfm from '../../hooks/useMfm';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import ReplyOwner from '../user/ReplyOwner';
import PostReplyToReply from './PostReplyToReply';
import { useAppStatusContextDataContext } from '../../../hooks/api/statuses/WithAppStatusContextData';
import {
	APP_COLOR_PALETTE_EMPHASIS,
	AppThemingUtil,
} from '../../../utils/theming.util';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { APP_FONTS } from '../../../styles/AppFonts';
import { appDimensions } from '../../../styles/dimensions';
import { AppText } from '../../lib/Text';

type ToggleReplyVisibilityProps = {
	enabled: boolean;
	expanded: boolean;
	onPress: () => void;
	count: number;
};

function ToggleReplyVisibility({
	enabled,
	expanded,
	onPress,
	count,
}: ToggleReplyVisibilityProps) {
	const { theme } = useAppTheme();
	if (!enabled) return <View />;

	const EXPANDED_COLOR = AppThemingUtil.getThreadColorForDepth(0);
	const COLLAPSED_COLOR = theme.complementary.a0;

	return (
		<Pressable style={styles.actionButton} onPress={onPress}>
			<View style={{ width: 24 }}>
				{expanded ? (
					<FontAwesome6 name="square-minus" size={20} color={EXPANDED_COLOR} />
				) : (
					<FontAwesome6 name="plus-square" size={20} color={COLLAPSED_COLOR} />
				)}
			</View>
			<View>
				<Text
					style={{
						color: expanded
							? AppThemingUtil.getThreadColorForDepth(0)
							: theme.complementary.a0,
					}}
				>
					{count} replies
				</Text>
			</View>
		</Pressable>
	);
}

function ToggleMediaVisibility({
	enabled,
	expanded,
	onPress,
	count,
}: ToggleReplyVisibilityProps) {
	const { theme } = useAppTheme();
	if (!enabled) return <View />;

	const EXPANDED_COLOR = AppThemingUtil.getThreadColorForDepth(0);
	const COLLAPSED_COLOR = theme.complementary.a0;

	return (
		<Pressable style={styles.actionButton} onPress={onPress}>
			<View style={{ width: 24 }}>
				<FontAwesome6
					name="image"
					size={20}
					color={expanded ? EXPANDED_COLOR : COLLAPSED_COLOR}
				/>
			</View>
			{expanded ? (
				<AppText.Medium style={{ color: EXPANDED_COLOR, marginLeft: 4 }}>
					Shown ({count})
				</AppText.Medium>
			) : (
				<AppText.Medium style={{ color: COLLAPSED_COLOR, marginLeft: 4 }}>
					Hidden ({count})
				</AppText.Medium>
			)}
		</Pressable>
	);
}

type PostReplyProps = {
	lookupId: string;
	colors: string[];
};

function PostReplyContent({ lookupId, colors }: PostReplyProps) {
	const { data, getChildren } = useAppStatusContextDataContext();

	const [ExplanationObject, setExplanationObject] = useState<string | null>(
		null,
	);

	const dto = data.lookup.get(lookupId);
	const children = getChildren(lookupId);

	const { content } = useMfm({
		content: dto.content.raw,
		emojiMap: dto.calculated.emojis as any,
		fontFamily: APP_FONTS.INTER_400_REGULAR,
		emphasis: APP_COLOR_PALETTE_EMPHASIS.A10,
	});

	const [IsMediaShown, setIsMediaShown] = useState(false);
	const [IsReplyThreadVisible, setIsReplyThreadVisible] = useState(false);

	const replyCount = dto.stats.replyCount;
	const mediaCount = dto.content.media.length;

	function toggleMediaVisibility() {
		setIsMediaShown(!IsMediaShown);
	}

	function toggleReplyVisibility() {
		setIsReplyThreadVisible(!IsReplyThreadVisible);
	}

	const DEPTH_COLOR = AppThemingUtil.getThreadColorForDepth(0);

	return (
		<View style={{ marginTop: 8, padding: 10 }}>
			<ReplyOwner dto={dto} />
			<View
				style={{ marginBottom: appDimensions.timelines.sectionBottomMargin }}
			>
				{content}
			</View>
			{ExplanationObject !== null && (
				<ExplainOutput
					additionalInfo={'Translated using OpenAI'}
					fromLang={'jp'}
					toLang={'en'}
					text={ExplanationObject}
				/>
			)}
			{IsMediaShown && (
				<MediaItem
					attachments={dto.content.media}
					calculatedHeight={dto.calculated.mediaContainerHeight}
				/>
			)}
			<View
				style={{
					marginBottom: appDimensions.timelines.sectionBottomMargin * 2,
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'flex-start',
				}}
			>
				<View style={{ marginRight: 4 }}>
					<ToggleReplyVisibility
						enabled={replyCount > 0}
						onPress={toggleReplyVisibility}
						expanded={IsReplyThreadVisible}
						count={replyCount}
					/>
				</View>
				<View>
					<ToggleMediaVisibility
						enabled={mediaCount > 0}
						onPress={toggleMediaVisibility}
						expanded={IsMediaShown}
						count={mediaCount}
					/>
				</View>
			</View>
			{/*	Reply Thread*/}
			{IsReplyThreadVisible && (
				<View>
					{children.map((o, i) => (
						<PostReplyToReply
							key={i}
							colors={[...colors, DEPTH_COLOR]}
							lookupId={o.id}
							depth={1}
						/>
					))}
				</View>
			)}
		</View>
	);
}

/**
 * Direct reply to a root level post
 *
 * Must be wrapped with by
 * WithActivitypubStatusContext
 * @constructor
 */
function PostReply({ lookupId, colors }: PostReplyProps) {
	return <PostReplyContent colors={colors} lookupId={lookupId} />;
}

const styles = StyleSheet.create({
	actionButton: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 8,
		marginLeft: -8,
		paddingVertical: 6,
		borderRadius: 8,
	},
});
export default PostReply;
