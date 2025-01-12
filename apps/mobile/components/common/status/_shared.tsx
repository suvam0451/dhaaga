import {
	useAppApiClient,
	useAppBottomSheet_Improved,
	useAppPublishers,
} from '../../../hooks/utility/global-state-extractors';
import ActivityPubService from '../../../services/activitypub.service';
import { APP_BOTTOM_SHEET_ENUM } from '../../dhaaga-bottom-sheet/Core';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppIcon } from '../../lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';
import { AppPostObject } from '../../../types/app-post.types';

type PostMoreOptionsButtonProps = {
	post: AppPostObject;
};

/**
 *
 * @param post
 * @constructor
 */
export function PostMoreOptionsButton({ post }: PostMoreOptionsButtonProps) {
	const { driver } = useAppApiClient();
	const { show, setCtx } = useAppBottomSheet_Improved();
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
	const { show, setCtx } = useAppBottomSheet_Improved();
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
	const { driver } = useAppApiClient();
	const { show, setCtx } = useAppBottomSheet_Improved();
	const { postPub } = useAppPublishers();

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

const styles = StyleSheet.create({
	statusMoreOptionsContainer: {
		justifyContent: 'flex-start',
		flexDirection: 'row',
		alignItems: 'flex-start',
		flexShrink: 1,
		height: '100%',
		paddingRight: 8,
		paddingTop: 4,
	},
	statusMoreOptionsButton: {
		height: '100%',
		paddingTop: 4,
		paddingLeft: 16,
	},
});
