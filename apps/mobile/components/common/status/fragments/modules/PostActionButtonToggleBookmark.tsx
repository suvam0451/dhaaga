import {
	useAppApiClient,
	useAppBottomSheet,
	useAppPublishers,
} from '#/states/global/hooks';
import { withPostItemContext } from '../../../../containers/contexts/WithPostItemContext';
import { ActivityPubService } from '@dhaaga/bridge';
import { Pressable } from 'react-native';
import DhaagaSkinnedIcon, { DHAAGA_SKINNED_ICON_ID } from '#/skins/_icons';
import { APP_BOTTOM_SHEET_ENUM } from '#/states/global/slices/createBottomSheetSlice';

/**
 * Bookmark toggle indicator button
 */
function PostActionButtonToggleBookmark() {
	const { driver } = useAppApiClient();
	const { dto } = withPostItemContext();
	const { show } = useAppBottomSheet();
	const { postObjectActions } = useAppPublishers();

	// helper functions
	async function _toggleBookmark() {
		show(APP_BOTTOM_SHEET_ENUM.ADD_BOOKMARK, true, {
			$type: 'post-id',
			postId: dto?.id,
		});
		if (ActivityPubService.misskeyLike(driver)) {
			postObjectActions.loadBookmarkState(dto?.uuid);
		}
	}

	const FLAG = dto?.interaction?.bookmarked;

	return (
		<Pressable
			style={{
				paddingVertical: 6,
				marginRight: -6,
				paddingHorizontal: 6,
			}}
			onPress={_toggleBookmark}
		>
			{FLAG ? (
				<DhaagaSkinnedIcon id={DHAAGA_SKINNED_ICON_ID.BOOKMARK_MENU_ACTIVE} />
			) : (
				<DhaagaSkinnedIcon id={DHAAGA_SKINNED_ICON_ID.BOOKMARK_MENU_INACTIVE} />
			)}
		</Pressable>
	);
}

export default PostActionButtonToggleBookmark;
