import { Dispatch, Fragment, SetStateAction } from 'react';
import { useAppApiClient, useAppBottomSheet } from '#/states/global/hooks';
import type { PostObjectType } from '@dhaaga/bridge';
import { DriverService, PostInspector } from '@dhaaga/bridge';
import { APP_BOTTOM_SHEET_ENUM } from '#/states/global/slices/createBottomSheetSlice';
import { usePostEventBusActions } from '#/hooks/pubsub/usePostEventBus';
import { AppDividerSoft } from '#/ui/Divider';
import BottomSheetActionItem from '#/ui/BottomSheetActionItem';

function MorePostActionsPresenter({
	setEditMode,
	item,
}: {
	setEditMode: Dispatch<SetStateAction<'root' | 'emoji'>>;
	item: PostObjectType;
}) {
	const { driver } = useAppApiClient();
	const _target = PostInspector.getContentTarget(item);
	const { show } = useAppBottomSheet();

	const IS_BOOKMARKED = _target?.interaction.bookmarked;
	const IS_LIKED = PostInspector.isLiked(_target);
	const IS_REACTED = _target?.stats?.reactions?.every((o) => o.me === false);

	let ReactionCta = 'Add Reaction';
	if (IS_REACTED) {
		if (DriverService.supportsPleromaApi(driver)) {
			ReactionCta = 'Add More Reactions';
		} else {
			ReactionCta = 'Change Reaction';
		}
	}

	const { toggleLike, toggleBookmark, toggleShare, shareLink, openInBrowser } =
		usePostEventBusActions(item.uuid);

	async function onClickAddReaction() {
		setEditMode('emoji');
	}

	async function onReply() {
		show(APP_BOTTOM_SHEET_ENUM.STATUS_COMPOSER, true, {
			$type: 'compose-reply',
			parentPostId: _target.uuid,
		});
	}

	return (
		<Fragment>
			{DriverService.canBookmark(driver) && (
				<BottomSheetActionItem
					iconId={'bookmark'}
					label={IS_BOOKMARKED ? 'Remove Bookmark' : 'Bookmark'}
					active={IS_BOOKMARKED}
					desc={'Save this post for later'}
					onPress={toggleBookmark}
				/>
			)}
			{DriverService.canLike(driver) && (
				<BottomSheetActionItem
					iconId={IS_LIKED ? 'heart' : 'heart-outline'}
					active={IS_LIKED}
					label={IS_LIKED ? 'Remove Like' : 'Add Like'}
					desc={'Your likes are visible to everyone'}
					onPress={toggleLike}
				/>
			)}
			{DriverService.canReact(driver) && (
				<BottomSheetActionItem
					iconId={'smiley'}
					label={ReactionCta}
					onPress={onClickAddReaction}
				/>
			)}

			<BottomSheetActionItem
				iconId={'chatbox-outline'}
				label={'Reply'}
				desc={'Respond to the post'}
				onPress={onReply}
			/>

			<BottomSheetActionItem
				iconId={'sync-outline'}
				label={'Repost'}
				desc={'Share the post with your friends'}
				onPress={toggleShare}
			/>
			<AppDividerSoft style={{ marginVertical: 4 }} />
			<BottomSheetActionItem
				iconId={'share'}
				active={false}
				label={'Copy or Share Link'}
				desc={'Opens the sharing sheet'}
				onPress={shareLink}
			/>
			<BottomSheetActionItem
				iconId={'browser'}
				label={'Open in Browser'}
				desc={'View in external browser'}
				onPress={openInBrowser}
			/>
		</Fragment>
	);
}

export default MorePostActionsPresenter;
