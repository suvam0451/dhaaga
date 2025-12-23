import { StyleProp, View, ViewStyle } from 'react-native';
import { AccountSavedUser } from '@dhaaga/db';
import type { PostObjectType } from '@dhaaga/bridge';
import UserBadge from '#/ui/UserBadge';
import useSheetNavigation from '#/states/navigation/useSheetNavigation';

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
				userId={user.identifier}
				avatarUrl={user.avatarUrl}
				displayName={user.displayName}
				handle={user.username}
				onAvatarPressed={onAvatarPressed}
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
	const { openUserProfileSheet } = useSheetNavigation();

	function onAvatarClicked() {
		openUserProfileSheet(post?.postedBy?.id);
	}

	return (
		<UserBadge
			userId={post.postedBy.id}
			avatarUrl={post.postedBy.avatarUrl}
			displayName={post.postedBy.displayName}
			parsedDisplayName={post.postedBy.parsedDisplayName}
			handle={post.postedBy.handle}
			emojiMap={post.calculated.emojis}
			onAvatarPressed={onAvatarClicked}
			style={style}
		/>
	);
}

export default PostCreatedBy;
