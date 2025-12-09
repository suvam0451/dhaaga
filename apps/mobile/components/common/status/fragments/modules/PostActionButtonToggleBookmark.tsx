import {
	useAppApiClient,
	useAppBottomSheet,
	useAppPublishers,
	useAppTheme,
} from '../../../../../hooks/utility/global-state-extractors';
import { withPostItemContext } from '../../../../containers/contexts/WithPostItemContext';
import { AppToggleIcon } from '../../../../lib/Icon';
import { appDimensions } from '../../../../../styles/dimensions';
import { ActivityPubService } from '@dhaaga/bridge';
import { APP_BOTTOM_SHEET_ENUM } from '../../../../../states/_global';

/**
 * Bookmark toggle indicator button
 */
function PostActionButtonToggleBookmark() {
	const { driver } = useAppApiClient();
	const { dto } = withPostItemContext();
	const { theme } = useAppTheme();
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
		<AppToggleIcon
			size={appDimensions.timelines.actionButtonSize}
			flag={FLAG}
			activeIconId={'bookmark'}
			inactiveIconId={'bookmark-outline'}
			inactiveTint={theme.secondary.a40}
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
