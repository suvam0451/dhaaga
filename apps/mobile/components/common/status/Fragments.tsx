import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { AppText } from '../../lib/Text';
import { StyleSheet, View } from 'react-native';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { appDimensions } from '#/styles/dimensions';
import { DatetimeUtil } from '#/utils/datetime.utils';
import type { AppParsedTextNodes } from '@dhaaga/bridge';
import { useAppTheme } from '#/states/global/hooks';
import TextAstRendererView from '#/ui/TextAstRendererView';
import { PostMoreOptionsButton } from '#/components/common/status/_shared';

type Props = {
	postId: string;
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
	postId,
	parsedText,
	driver,
	createdAt,
	altText,
}: Props) {
	if (driver === KNOWN_SOFTWARE.BLUESKY)
		return (
			<View style={timelineStyles.oneLineDisplayNameRoot}>
				<View style={{ flex: 1 }}>
					{parsedText ? (
						<TextAstRendererView
							tree={parsedText}
							variant={'displayName'}
							mentions={[]}
							emojiMap={new Map()}
						/>
					) : (
						<AppText.Medium>{altText}</AppText.Medium>
					)}
				</View>
				<PostMoreOptionsButton postId={postId} createdAt={createdAt} />
			</View>
		);

	return (
		<View style={timelineStyles.oneLineDisplayNameRoot}>
			<View style={{ flex: 1, flexShrink: 1 }}>
				{parsedText && parsedText.length > 0 ? (
					<TextAstRendererView
						tree={parsedText}
						variant={'displayName'}
						mentions={[]}
						emojiMap={new Map()}
					/>
				) : (
					<AppText.Normal
						style={{ fontSize: 13 }}
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A40}
					>
						{altText}
					</AppText.Normal>
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
	const { theme } = useAppTheme();
	return (
		<View
			style={{
				position: 'absolute',
				height: '100%',
				left: 18,
			}}
		>
			<View
				style={{
					flex: 1,
					marginTop: 52,
					marginBottom: 8,
					width: 1.5,
					backgroundColor: theme.background.a50, // '#323232',
				}}
			/>
		</View>
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
		marginBottom: appDimensions.timelines.sectionBottomMargin,
	},
	oneLineDisplayNameRoot: {
		flexDirection: 'row',
		flex: 1,
		alignItems: 'center',
		marginBottom: appDimensions.timelines.sectionBottomMargin * 0.75,
	},
});

export { PostedByTextOneLine, ReplyIndicator, timelineStyles };
