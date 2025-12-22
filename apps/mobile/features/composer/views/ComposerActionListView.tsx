import { useAppTheme } from '#/states/global/hooks';
import { Pressable, View, StyleSheet } from 'react-native';
import { AppIcon } from '#/components/lib/Icon';
import { Ionicons } from '@expo/vector-icons';
import { NativeTextBold } from '#/ui/NativeText';
import {
	useComposerFeatureCompatibility,
	useComposerModes,
} from '#/features/composer/hooks/useComposerFeatureCompatibility';
import { usePostComposerState } from '@dhaaga/react';

const ICON_SIZE = 26;

/**
 * Options to add extra stuff to a post
 *
 * - TXT mode: cw,
 */
function ComposerActionListView() {
	const { theme } = useAppTheme();
	const {
		canAttachMedia,
		canAttachVideo,
		supportsContentWarning,
		supportsCustomEmojis,
		canUseGif,
	} = useComposerFeatureCompatibility();
	const State = usePostComposerState();
	const { onPressMediaTab, onPressEmojiTab, onPressContentWarningButton } =
		useComposerModes();
	const DEFAULT_COLOR = theme.complementary;
	const ACTIVE_COLOR = theme.primary;

	const isCwUsed = !!State.cw;

	return (
		<View style={styles.root}>
			{canAttachMedia ? (
				<Pressable style={styles.pressableContainer} onPress={onPressMediaTab}>
					<AppIcon id={'images'} size={ICON_SIZE} color={DEFAULT_COLOR} />
				</Pressable>
			) : (
				<View />
			)}
			{canAttachVideo ? (
				<Pressable style={styles.pressableContainer}>
					<Ionicons name="videocam" size={ICON_SIZE} color={DEFAULT_COLOR} />
				</Pressable>
			) : (
				<View />
			)}
			{supportsContentWarning ? (
				<Pressable
					style={styles.pressableContainer}
					onPress={onPressContentWarningButton}
				>
					<Ionicons
						name="warning"
						size={ICON_SIZE}
						color={isCwUsed ? ACTIVE_COLOR : DEFAULT_COLOR}
						onPress={onPressContentWarningButton}
					/>
				</Pressable>
			) : (
				<View />
			)}
			{supportsCustomEmojis && (
				<Pressable style={styles.pressableContainer} onPress={onPressEmojiTab}>
					<Ionicons
						name={'happy'}
						size={ICON_SIZE}
						color={DEFAULT_COLOR}
						onPress={onPressEmojiTab}
					/>
				</Pressable>
			)}
			{canUseGif && (
				<Pressable style={styles.pressableContainer}>
					<NativeTextBold
						style={{
							fontSize: 18,
							color: DEFAULT_COLOR,
						}}
					>
						GIF
					</NativeTextBold>
				</Pressable>
			)}
			<Pressable style={styles.pressableContainer}>
				<NativeTextBold
					style={{
						fontSize: 18,
						color: DEFAULT_COLOR,
					}}
				>
					EN
				</NativeTextBold>
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
