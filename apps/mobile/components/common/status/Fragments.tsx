import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { AppText } from '../../lib/Text';
import { Pressable, StyleSheet, View } from 'react-native';
import useMfm from '../../hooks/useMfm';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';
import { appDimensions } from '../../../styles/dimensions';
import { DatetimeUtil } from '../../../utils/datetime.utils';
import { APP_FONTS } from '../../../styles/AppFonts';
import useAppNavigator from '../../../states/useAppNavigator';
import { AppParsedTextNodes } from '../../../types/parsed-text.types';
import { TextContentView } from './TextContentView';

type MfmComponentProps = {
	raw: string;
	knownReactions: Map<string, string>;
	fontFamily?: string;
	numberOfLines?: number;
	emphasis?: APP_COLOR_PALETTE_EMPHASIS;
};

type PostedByTextOneLineProps = {
	parsedText: AppParsedTextNodes;
	altText: string;
	driver: KNOWN_SOFTWARE;
	createdAt: Date | string;
	visibility?: any;
};

/**
 * Shows the
 * @param text
 * @param driver
 * @param createdAt
 * @param altText
 * @constructor
 */
function PostedByTextOneLine({
	parsedText,
	driver,
	createdAt,
	altText,
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
				<AppText.Medium>{parsedText}</AppText.Medium>
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

	return (
		<View
			style={{
				flexDirection: 'row',
				flex: 1,
				alignItems: 'center',
				marginBottom: appDimensions.timelines.sectionBottomMargin,
			}}
		>
			<View style={{ flex: 1, flexShrink: 1 }}>
				{parsedText ? (
					<TextContentView
						tree={parsedText}
						variant={'displayName'}
						mentions={[]}
						emojiMap={new Map()}
					/>
				) : (
					<AppText.Medium>{altText}</AppText.Medium>
				)}
			</View>
			<AppText.Normal
				style={{
					fontSize: 13,
					marginRight: 6,
				}}
				emphasis={APP_COLOR_PALETTE_EMPHASIS.A40}
			>
				{DatetimeUtil.timeAgo(createdAt)}
			</AppText.Normal>
		</View>
	);
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
