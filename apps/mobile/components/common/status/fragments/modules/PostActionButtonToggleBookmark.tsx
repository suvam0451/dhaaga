import {
	useAppApiClient,
	useAppBottomSheet_Improved,
	useAppPublishers,
	useAppTheme,
} from '../../../../../hooks/utility/global-state-extractors';
import { APP_BOTTOM_SHEET_ENUM } from '../../../../dhaaga-bottom-sheet/Core';
import { useAppStatusItem } from '../../../../../hooks/ap-proto/useAppStatusItem';
import { AppToggleIcon } from '../../../../lib/Icon';
import { appDimensions } from '../../../../../styles/dimensions';
import ActivityPubService from '../../../../../services/activitypub.service';

/**
 * Bookmark toggle indicator button
 */
function PostActionButtonToggleBookmark() {
	const { driver } = useAppApiClient();
	const { dto } = useAppStatusItem();
	const { theme } = useAppTheme();
	const { show, setCtx } = useAppBottomSheet_Improved();
	const { postPub } = useAppPublishers();

	// helper functions
	function _toggleBookmark() {
		if (ActivityPubService.misskeyLike(driver)) {
			postPub.finalizeBookmarkState(dto?.uuid).finally(() => {});
		}
		setCtx({ uuid: dto?.uuid });
		show(APP_BOTTOM_SHEET_ENUM.ADD_BOOKMARK, true);
	}

	/**
	 * TODO: need to understand misskey's take
	 * on bookmarks and why it is a separate API
	 *
	 * NOTE: disabled to not trigger rate limits
	 */
	// const { finalizeBookmarkState } = usePostActionsInterface();
	// const [BookmarkStatePending, setBookmarkStatePending] = useState(false);
	// useEffect(() => {
	// 	setBookmarkStatePending(true);
	// 	finalizeBookmarkState(id).finally(() => {
	// 		setBookmarkStatePending(false);
	// 	});
	// }, [id]);

	const FLAG = dto?.interaction?.bookmarked;

	return (
		<AppToggleIcon
			size={appDimensions.timelines.actionButtonSize}
			flag={FLAG}
			activeIconId={'bookmark'}
			inactiveIconId={'bookmark-outline'}
			inactiveTint={theme.secondary.a10}
			activeTint={theme.primary.a0}
			onPress={_toggleBookmark}
		/>
	);
}

export default PostActionButtonToggleBookmark;
