import { DriverService } from '@dhaaga/bridge';
import { useAppApiClient, useAppBottomSheet } from '#/states/global/hooks';
import { APP_BOTTOM_SHEET_ENUM } from '#/states/global/slices/createBottomSheetSlice';

function useSheetNavigation() {
	const { driver } = useAppApiClient();
	const { show } = useAppBottomSheet();

	function openUserProfileSheet(id: string) {
		let ctx = null;
		if (DriverService.supportsAtProto(driver)) {
			ctx = {
				$type: 'user-preview',
				use: 'did',
				did: id,
			};
		} else {
			ctx = {
				$type: 'user-preview',
				use: 'userId',
				userId: id,
			};
		}
		show(APP_BOTTOM_SHEET_ENUM.USER_PREVIEW, true, ctx);
	}

	return { openUserProfileSheet };
}

export default useSheetNavigation;
