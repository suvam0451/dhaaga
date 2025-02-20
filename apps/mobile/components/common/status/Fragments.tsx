import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { AppText } from '../../lib/Text';
import { StyleSheet, View } from 'react-native';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';
import { appDimensions } from '../../../styles/dimensions';
import { DatetimeUtil } from '../../../utils/datetime.utils';
import type { AppParsedTextNodes } from '@dhaaga/core';
import { TextContentView } from './TextContentView';

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
			<View style={timelineStyles.oneLineDisplayNameRoot}>
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
		<View style={timelineStyles.oneLineDisplayNameRoot}>
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
				left: 18,
			}}
		>
			<View
				style={{
					flex: 1,
					marginTop: 48,
					marginBottom: 4,
					width: 1.5,
					backgroundColor: '#424242',
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
	},
});

export { PostedByTextOneLine, ReplyIndicator, timelineStyles };
