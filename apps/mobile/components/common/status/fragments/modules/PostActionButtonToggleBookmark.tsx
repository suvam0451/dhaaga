import {
	useAppApiClient,
	useAppBottomSheet_Improved,
	useAppPublishers,
	useAppTheme,
} from '../../../../../hooks/utility/global-state-extractors';
import { useAppStatusItem } from '../../../../../hooks/ap-proto/useAppStatusItem';
import { AppToggleIcon } from '../../../../lib/Icon';
import { appDimensions } from '../../../../../styles/dimensions';
import ActivityPubService from '../../../../../services/activitypub.service';
import { APP_BOTTOM_SHEET_ENUM } from '../../../../../states/_global';

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
			inactiveTint={theme.secondary.a20}
			activeTint={theme.primary.a0}
			onPress={_toggleBookmark}
			style={{
				paddingVertical: 6,
				marginRight: -6,
				paddingHorizontal: 6,
			}}
		/>
	);
}

export default PostActionButtonToggleBookmark;
