import {
	useAppApiClient,
	useAppBottomSheet,
	useAppPublishers,
} from '#/hooks/utility/global-state-extractors';
import { withPostItemContext } from '../../../../containers/contexts/WithPostItemContext';
import { ActivityPubService } from '@dhaaga/bridge';
import { APP_BOTTOM_SHEET_ENUM } from '#/states/_global';
import { Pressable } from 'react-native';
import DhaagaSkinnedIcon, { DHAAGA_SKINNED_ICON_ID } from '#/skins/_icons';

/**
 * Bookmark toggle indicator button
 */
function PostActionButtonToggleBookmark() {
	const { driver } = useAppApiClient();
	const { dto } = withPostItemContext();
	const { show, setCtx } = useAppBottomSheet();
	const { postObjectActions } = useAppPublishers();

	// helper functions
	function _toggleBookmark() {
		if (ActivityPubService.misskeyLike(driver)) {
			postObjectActions.loadBookmarkState(dto?.uuid);
		}
		setCtx({ uuid: dto?.uuid });
		show(APP_BOTTOM_SHEET_ENUM.ADD_BOOKMARK, true);
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
