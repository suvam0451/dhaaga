import { FAB_MENU_ICON_SIZE, FabModuleProps } from './_common';
import { memo, useCallback } from 'react';
import { APP_FONT } from '../../../../styles/AppTheme';
import { FabMenuItemText } from '../fragments/FabMenuItemIcon';
import { FabMenuItemFactory } from '../fragments/FabMenuItemFactory';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import {
	APP_BOTTOM_SHEET_ENUM,
	useAppBottomSheet,
} from '../../../dhaaga-bottom-sheet/modules/_api/useAppBottomSheet';

const MENU_ITEM_LABEL = 'Create Post';

const CreatePostModule = memo(({ index }: FabModuleProps) => {
	const {
		setVisible,
		setType,
		PostComposerTextSeedRef,
		PostRef,
		updateRequestId,
	} = useAppBottomSheet();

	const onClick = useCallback(() => {
		PostComposerTextSeedRef.current = null;
		PostRef.current = null;

		setType(APP_BOTTOM_SHEET_ENUM.STATUS_COMPOSER);
		updateRequestId();
		setVisible(true);
	}, [PostComposerTextSeedRef, PostRef]);

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
});

export default CreatePostModule;
