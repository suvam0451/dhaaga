import { useAppTheme } from '#/states/global/hooks';
import { Pressable, View, StyleSheet } from 'react-native';
import { AppIcon } from '#/components/lib/Icon';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '#/components/lib/Text';
import { APP_FONTS } from '#/styles/AppFonts';

const ICON_SIZE = 26;

type Props = {
	canUseCw: boolean;
	canUseMedia: boolean;
	canUseVideo: boolean;
	canUseGif: boolean;
	canUseCustomEmoji: boolean;

	isMediaDisabled: boolean;
	isVideoDisabled: boolean;
	isGifDisabled: boolean;

	isCwUsed: boolean;
	mediaCount: number | null;
	isVideoUsed: boolean;
	isGifUsed: boolean;

	onCwPressed: () => void;
	onMediaPressed: () => void;
	onVideoPressed: () => void;
	onGifPressed: () => void;
	onCustomEmojiPressed: () => void;
};

/**
 * Options to add extra stuff to a post
 *
 * - TXT mode: cw,
 */
function ComposerActionListView({
	canUseCw,
	canUseMedia,
	canUseVideo,
	canUseGif,
	canUseCustomEmoji,

	isMediaDisabled,
	isVideoDisabled,
	isGifDisabled,

	isCwUsed,
	mediaCount,
	isVideoUsed,
	isGifUsed,

	onCwPressed,
	onMediaPressed,
	onVideoPressed,
	onGifPressed,
	onCustomEmojiPressed,
}: Props) {
	const { theme } = useAppTheme();

	const DEFAULT_COLOR = theme.complementary.a0;
	const ACTIVE_COLOR = theme.primary.a0;

	return (
		<View style={styles.root}>
			{canUseMedia && (
				<Pressable style={styles.pressableContainer} onPress={onMediaPressed}>
					<AppIcon
						id={'images'}
						size={ICON_SIZE}
						color={DEFAULT_COLOR}
						onPress={onMediaPressed}
					/>
				</Pressable>
			)}
			{canUseVideo && (
				<Pressable style={styles.pressableContainer}>
					<Ionicons name="videocam" size={ICON_SIZE} color={DEFAULT_COLOR} />
				</Pressable>
			)}
			{canUseCw && (
				<Pressable style={styles.pressableContainer} onPress={onCwPressed}>
					<Ionicons
						name="warning"
						size={ICON_SIZE}
						color={isCwUsed ? ACTIVE_COLOR : DEFAULT_COLOR}
						onPress={onCwPressed}
					/>
				</Pressable>
			)}
			{canUseCustomEmoji && (
				<Pressable
					style={styles.pressableContainer}
					onPress={onCustomEmojiPressed}
				>
					<Ionicons
						name={'happy'}
						size={ICON_SIZE}
						color={DEFAULT_COLOR}
						onPress={onCustomEmojiPressed}
					/>
				</Pressable>
			)}
			{canUseGif && (
				<Pressable style={styles.pressableContainer}>
					<AppText.Medium
						style={{
							fontSize: 18,
							color: DEFAULT_COLOR,
							fontFamily: APP_FONTS.INTER_500_MEDIUM,
						}}
					>
						GIF
					</AppText.Medium>
				</Pressable>
			)}
			<Pressable style={styles.pressableContainer}>
				<AppText.Medium
					style={{
						fontSize: 18,
						color: DEFAULT_COLOR,
						fontFamily: APP_FONTS.INTER_500_MEDIUM,
					}}
				>
					EN
				</AppText.Medium>
			</Pressable>
		</View>
	);
}

export default ComposerActionListView;

const ICON_HORIZONTAL_PADDING = 6;

const styles = StyleSheet.create({
	root: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},
	pressableContainer: {
		paddingVertical: 10,
		paddingHorizontal: ICON_HORIZONTAL_PADDING,
	},
});
