import {
	useAppApiClient,
	useAppBottomSheet,
	useAppPublishers,
	useAppTheme,
} from '../../../hooks/utility/global-state-extractors';
import { ActivityPubService } from '@dhaaga/bridge';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppIcon } from '../../lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';
import type { PostObjectType } from '@dhaaga/bridge';
import { Fragment } from 'react';
import { AccountSavedPost } from '@dhaaga/db';
import { APP_BOTTOM_SHEET_ENUM } from '../../../states/_global';
import { DatetimeUtil } from '../../../utils/datetime.utils';
import { AppText } from '../../lib/Text';

type PostMoreOptionsButtonProps = {
	post: PostObjectType;
};

/**
 *
 * @param post
 * @constructor
 */
export function PostMoreOptionsButton({ post }: PostMoreOptionsButtonProps) {
	const { driver } = useAppApiClient();
	const { show, setCtx } = useAppBottomSheet();
	const { postPub } = useAppPublishers();
	const { theme } = useAppTheme();

	function onPress() {
		if (ActivityPubService.misskeyLike(driver)) {
			postPub.finalizeBookmarkState(post?.uuid).finally(() => {});
		}
		setCtx({ uuid: post.uuid });
		show(APP_BOTTOM_SHEET_ENUM.MORE_POST_ACTIONS, true);
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
				{DatetimeUtil.timeAgo(post.createdAt)}
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
	post: AccountSavedPost;
};

/**
 *
 * @param post
 * @constructor
 */
export function SavedPostMoreOptionsButton({
	post,
}: SavedPostMoreOptionsButtonProps) {
	const { driver } = useAppApiClient();
	const { show, setCtx } = useAppBottomSheet();
	const { postPub } = useAppPublishers();

	function onPress() {
		setCtx({ uuid: post.uuid });
		// show(APP_BOTTOM_SHEET_ENUM.MORE_POST_ACTIONS, true);
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
 * Slightly less padding that the above variant
 * @param post
 * @constructor
 */
export function MiniMoreOptionsButton({ post }: PostMoreOptionsButtonProps) {
	const { driver } = useAppApiClient();
	const { show, setCtx } = useAppBottomSheet();
	const { postPub } = useAppPublishers();

	function onPress() {
		if (ActivityPubService.misskeyLike(driver)) {
			postPub.finalizeBookmarkState(post?.uuid).finally(() => {});
		}
		setCtx({ uuid: post.uuid });
		show(APP_BOTTOM_SHEET_ENUM.MORE_POST_ACTIONS, true);
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
					size={20}
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
			<View
				style={{
					backgroundColor: '#1c1c1c',
					height: 1,
					marginVertical: 10,
				}}
			/>
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
		height: '100%',
		paddingTop: 4,
		paddingLeft: 4,
	},
});
