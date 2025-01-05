import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { AppText } from '../../lib/Text';
import { Pressable, StyleSheet, View } from 'react-native';
import useMfm from '../../hooks/useMfm';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';
import { appDimensions } from '../../../styles/dimensions';
import { DatetimeUtil } from '../../../utils/datetime.utils';
import { APP_FONTS } from '../../../styles/AppFonts';
import useAppNavigator from '../../../states/useAppNavigator';

type MfmComponentProps = {
	raw: string;
	knownReactions: Map<string, string>;
	fontFamily?: string;
	numberOfLines?: number;
	emphasis?: APP_COLOR_PALETTE_EMPHASIS;
};

function MfmComponent({ raw, knownReactions, ...rest }: MfmComponentProps) {
	const { content, isLoaded } = useMfm({
		...rest,
		content: raw,
		emojiMap: knownReactions,
	});

	if (!isLoaded) return <View />;
	return <>{content}</>;
}

type PostedByTextOneLineProps = {
	text: string;
	driver: KNOWN_SOFTWARE;
	createdAt: Date | string;
	visibility?: any;
};

function PostedByTextOneLine({
	text,
	driver,
	createdAt,
}: PostedByTextOneLineProps) {
	if (driver === KNOWN_SOFTWARE.BLUESKY)
		return (
			<View
				style={{
					flexDirection: 'row',
					flex: 1,
					alignItems: 'center',
					marginBottom: appDimensions.timelines.sectionBottomMargin,
				}}
			>
				<AppText.Medium>{text}</AppText.Medium>
				<AppText.Normal
					style={{
						fontSize: 13,
					}}
					emphasis={APP_COLOR_PALETTE_EMPHASIS.A40}
				>
					{' • '}
					{DatetimeUtil.timeAgo(createdAt)}
				</AppText.Normal>
			</View>
		);

	const VALID_DISPLAY_NAME = text !== null && text !== '';

	if (!VALID_DISPLAY_NAME) return <View />;

	return <MfmComponent raw={text} knownReactions={new Map()} />;
}

function ReplyIndicator() {
	return (
		<View
			style={{
				position: 'absolute',
				height: '100%',
				left: 16,
			}}
		>
			<View
				style={{
					flex: 1,
					marginTop: 48,
					marginBottom: 8,
					width: 1.5,
					backgroundColor: '#323232',
				}}
			/>
		</View>
	);
}

type PostTextContentProps = {
	postId: string;
	raw: string;
	disableTouch?: boolean;
	emojis?: Map<string, string>;
};

function PostTextContent({
	postId,
	raw,
	disableTouch,
	emojis,
}: PostTextContentProps) {
	const { toPost } = useAppNavigator();
	const { content, isLoaded } = useMfm({
		content: raw,
		emojiMap: emojis,
		fontFamily: APP_FONTS.INTER_400_REGULAR,
		emphasis: APP_COLOR_PALETTE_EMPHASIS.A10,
	});

	// TODO: render skeleton based on content size
	if (!isLoaded) return <View />;
	return (
		<Pressable
			onPress={() => {
				if (!disableTouch) {
					toPost(postId);
				}
			}}
			style={{
				marginBottom: appDimensions.timelines.sectionBottomMargin * 2,
			}}
		>
			{content}
		</Pressable>
	);
}

const timelineStyles = StyleSheet.create({
	parentPostRootView: {
		position: 'relative',
		flexDirection: 'row',
		alignItems: 'flex-start',
	},
	parentPostContentView: {
		marginLeft: 8,
		position: 'relative',
		flex: 1,
		marginBottom: appDimensions.timelines.sectionBottomMargin * 4,
	},
});

export { PostedByTextOneLine, ReplyIndicator, PostTextContent, timelineStyles };
