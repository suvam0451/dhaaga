import {
	useAppApiClient,
	useAppBottomSheet,
	useAppPublishers,
	useAppTheme,
} from '#/states/global/hooks';
import { ActivityPubService } from '@dhaaga/bridge';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppIcon } from '../../lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { Fragment } from 'react';
import { DatetimeUtil } from '#/utils/datetime.utils';
import { AppText } from '../../lib/Text';
import { APP_BOTTOM_SHEET_ENUM } from '#/states/global/slices/createBottomSheetSlice';
import { usePostEventBusActions } from '#/hooks/pubsub/usePostEventBus';

type PostMoreOptionsButtonProps = {
	postId: string;
	createdAt: Date | string;
};

/**
 *
 * @param post
 * @constructor
 */
export function PostMoreOptionsButton({
	postId,
	createdAt,
}: PostMoreOptionsButtonProps) {
	const { driver } = useAppApiClient();
	const { show } = useAppBottomSheet();
	const { postEventBus } = useAppPublishers();
	const { theme } = useAppTheme();

	function onPress() {
		if (ActivityPubService.misskeyLike(driver)) {
			postEventBus.loadBookmarkState(postId);
		}
		show(APP_BOTTOM_SHEET_ENUM.MORE_POST_ACTIONS, true, {
			$type: 'post-id',
			postId: postId,
		});
	}

	return (
		<Pressable style={styles.statusMoreOptionsContainer} onPress={onPress}>
			<AppText.Normal
				style={{
					color: theme.secondary.a50,
					fontSize: 13,
					paddingTop: 2,
				}}
			>
				{DatetimeUtil.timeAgo(createdAt)}
			</AppText.Normal>
			<View style={styles.statusMoreOptionsButton}>
				<AppIcon
					id={'more-options-vertical'}
					emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
					size={16}
					onPress={onPress}
				/>
			</View>
		</Pressable>
	);
}

type SavedPostMoreOptionsButtonProps = {
	postId: string;
};

/**
 *
 * @param post
 * @constructor
 */
export function SavedPostMoreOptionsButton({
	postId,
}: SavedPostMoreOptionsButtonProps) {
	const { show } = useAppBottomSheet();
	function onPress() {
		show(APP_BOTTOM_SHEET_ENUM.MORE_POST_ACTIONS, true, {
			$type: 'post-id',
			postId: postId,
		});
	}

	return (
		<Pressable style={styles.statusMoreOptionsContainer} onPress={onPress}>
			<View style={styles.statusMoreOptionsButton}>
				<AppIcon
					id={'more-options-vertical'}
					emphasis={APP_COLOR_PALETTE_EMPHASIS.A40}
					size={16}
					onPress={onPress}
				/>
			</View>
		</Pressable>
	);
}

/**
 * For replies
 *
 * Slightly less padding than the above variant
 * @param post
 * @constructor
 */
export function MiniMoreOptionsButton({ postId }: PostMoreOptionsButtonProps) {
	const { driver } = useAppApiClient();
	const { show } = useAppBottomSheet();

	const { loadBookmarkState } = usePostEventBusActions(postId);

	function onPress() {
		if (ActivityPubService.misskeyLike(driver)) {
			loadBookmarkState();
		}
		show(APP_BOTTOM_SHEET_ENUM.MORE_POST_ACTIONS, true, {
			$type: 'post-id',
			postId: postId,
		});
	}

	return (
		<Pressable style={styles.statusMoreOptionsContainer} onPress={onPress}>
			<View
				style={[
					styles.statusMoreOptionsButton,
					{
						paddingLeft: 4,
					},
				]}
			>
				<AppIcon
					id={'more-options-vertical'}
					emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
					size={16}
					onPress={onPress}
				/>
			</View>
		</Pressable>
	);
}

export function MiniReplyButton({}: PostMoreOptionsButtonProps) {
	function onPress() {
		console.log('reply prompt pasted...');
	}

	return (
		<Pressable style={styles.statusMoreOptionsContainer} onPress={onPress}>
			<View style={styles.statusMoreOptionsButton}>
				<AppIcon
					id={'chatbox-outline'}
					emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
					size={20}
					onPress={onPress}
				/>
			</View>
		</Pressable>
	);
}

/**
 * Essential padding and spacing for
 * timeline post items (be it loaded
 * locally or using server api)
 * @param children
 * @constructor
 */
export function PostContainer({ children }: any) {
	const { theme } = useAppTheme();
	return (
		<Fragment>
			<View
				style={{
					paddingHorizontal: 10,
					backgroundColor: theme.palette.bg,
				}}
			>
				{children}
			</View>
		</Fragment>
	);
}

const styles = StyleSheet.create({
	statusMoreOptionsContainer: {
		justifyContent: 'flex-start',
		flexDirection: 'row',
		alignItems: 'flex-start',
		flexShrink: 1,
		height: '100%',
		paddingRight: 4,
		paddingTop: 4,
	},
	statusMoreOptionsButton: {
		paddingTop: 4,
		paddingLeft: 4,
	},
});
