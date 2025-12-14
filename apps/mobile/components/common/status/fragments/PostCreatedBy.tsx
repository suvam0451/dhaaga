import { StyleProp, View, ViewStyle } from 'react-native';
import { useRef } from 'react';
import { useAppApiClient, useAppBottomSheet } from '#/states/global/hooks';
import useAppNavigator from '#/states/useAppNavigator';
import { AccountSavedUser } from '@dhaaga/db';
import type { PostObjectType } from '@dhaaga/bridge';
import { ActivityPubService } from '@dhaaga/bridge';
import { APP_BOTTOM_SHEET_ENUM } from '#/states/global/slices/createBottomSheetSlice';
import UserBadge from '#/ui/UserBadge';

type SavedPostCreatedByProps = {
	user: AccountSavedUser;
	authoredAt: Date | string;
	style?: StyleProp<ViewStyle>;
};

/**
 * Author indicator for a post
 *
 * The local version must check online
 * connectivity and resolve the handle
 * prior t show information
 * @constructor
 */
export function SavedPostCreatedBy({
	user,
	style,
	authoredAt,
}: SavedPostCreatedByProps) {
	// resolve to handle and show modal
	function onAvatarPressed() {}

	// redirect to profile
	function onProfilePressed() {}

	if (!user) return <View />;

	return (
		<View
			style={[
				{
					alignItems: 'center',
					flexDirection: 'row',
					flexGrow: 1,
					width: 'auto',
					position: 'relative',
				},
				style,
			]}
		>
			<UserBadge
				avatarUrl={user.avatarUrl}
				displayName={user.displayName}
				handle={user.username}
				onAvatarPressed={onAvatarPressed}
				onDisplayNamePressed={onProfilePressed}
				style={style}
			/>
		</View>
	);
}

type OriginalPosterProps = {
	style?: StyleProp<ViewStyle>;
	// pass by reference to avoid incorrect author
	post: PostObjectType;
};

/**
 * This is the author indicator for
 * the bottom-most post-item
 */
function PostCreatedBy({ style, post }: OriginalPosterProps) {
	const { show } = useAppBottomSheet();
	const { toProfile } = useAppNavigator();
	const { driver } = useAppApiClient();

	const UserDivRef = useRef(null);

	function onAvatarClicked() {
		let ctx = null;
		if (ActivityPubService.blueskyLike(driver)) {
			ctx = {
				$type: 'user-preview',
				use: 'did',
				did: post?.postedBy?.id,
			};
		} else {
			ctx = {
				$type: 'user-preview',
				use: 'userId',
				userId: post?.postedBy?.id,
			};
		}
		show(APP_BOTTOM_SHEET_ENUM.USER_PREVIEW, true, ctx);

		// UserDivRef.current.measureInWindow((x, y, width, height) => {
		// 	appManager.storage.setUserPeekModalData(STATUS_DTO.postedBy.id, {
		// 		x,
		// 		y,
		// 		width,
		// 		height,
		// 	});
		// 	refresh();
		// 	setTimeout(() => {
		// 		show();
		// 	}, 100);
		// });
	}

	function onProfileClicked() {
		toProfile(post?.postedBy?.id);
	}

	return (
		<UserBadge
			avatarUrl={post.postedBy.avatarUrl}
			displayName={post.postedBy.displayName}
			parsedDisplayName={post.postedBy.parsedDisplayName}
			handle={post.postedBy.handle}
			emojiMap={post.calculated.emojis}
			onAvatarPressed={onAvatarClicked}
			onDisplayNamePressed={onProfileClicked}
			style={style}
		/>
	);
}

export default PostCreatedBy;
