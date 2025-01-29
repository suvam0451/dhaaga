import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { Pressable, View, StyleSheet } from 'react-native';
import { AppIcon } from '../../../components/lib/Icon';
import { Ionicons } from '@expo/vector-icons';

const ICON_SIZE = 26;
const ICON_HORIZONTAL_PADDING = 6;

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
				<Pressable
					style={{
						paddingHorizontal: ICON_HORIZONTAL_PADDING,
					}}
					onPress={onMediaPressed}
				>
					<AppIcon
						id={'images'}
						size={ICON_SIZE}
						color={DEFAULT_COLOR}
						onPress={onMediaPressed}
					/>
				</Pressable>
			)}
			{!canUseVideo && (
				<Pressable
					style={{
						paddingHorizontal: ICON_HORIZONTAL_PADDING,
					}}
				>
					<Ionicons name="videocam" size={ICON_SIZE} color={DEFAULT_COLOR} />
				</Pressable>
			)}
			{canUseCw && (
				<Pressable
					style={{
						paddingHorizontal: ICON_HORIZONTAL_PADDING,
					}}
					onPress={onCwPressed}
				>
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
					style={{
						paddingHorizontal: ICON_HORIZONTAL_PADDING,
					}}
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
		</View>
	);
}

export default ComposerActionListView;

const styles = StyleSheet.create({
	root: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},
});
