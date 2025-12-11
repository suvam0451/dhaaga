import { FAB_MENU_ICON_SIZE, FabModuleProps } from './_common';
import { APP_FONT } from '#/styles/AppTheme';
import { FabMenuItemText } from '../fragments/FabMenuItemIcon';
import { FabMenuItemFactory } from '../fragments/FabMenuItemFactory';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useAppBottomSheet } from '#/states/global/hooks';
import { APP_BOTTOM_SHEET_ENUM } from '#/states/global/slices/createBottomSheetSlice';

const MENU_ITEM_LABEL = 'Create Post';

function CreatePostModule({ index }: FabModuleProps) {
	const { show, setCtx } = useAppBottomSheet();

	function onClick() {
		setCtx({ uuid: null });
		show(APP_BOTTOM_SHEET_ENUM.STATUS_COMPOSER, true);
	}

	return (
		<FabMenuItemFactory
			index={index}
			onClick={onClick}
			IconComponent={
				<FontAwesome6
					name="edit"
					size={FAB_MENU_ICON_SIZE}
					color={APP_FONT.MONTSERRAT_BODY}
				/>
			}
			TextComponent={<FabMenuItemText label={MENU_ITEM_LABEL} />}
		/>
	);
}

export default CreatePostModule;
