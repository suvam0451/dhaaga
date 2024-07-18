import { FAB_MENU_ICON_SIZE, FabModuleProps } from './_common';
import { memo, useCallback } from 'react';
import { FabMenuItemFactory } from '../fragments/FabMenuItemFactory';
import { FabMenuItemText } from '../fragments/FabMenuItemIcon';
import Ionicons from '@expo/vector-icons/Ionicons';
import { APP_FONT } from '../../../../styles/AppTheme';
import { useAppDrawerContext } from '../../../../states/useAppDrawer';

const MENU_ITEM_LABEL = 'Sidebar Toggle';

const SidebarToggleModule = memo(({ index }: FabModuleProps) => {
	const { setOpen } = useAppDrawerContext();

	const onClick = useCallback(() => {
		console.log('sidebar toggle clicked...');
		setOpen(true);
	}, []);

	return (
		<FabMenuItemFactory
			index={index}
			onClick={onClick}
			TextComponent={<FabMenuItemText label={MENU_ITEM_LABEL} />}
			IconComponent={
				<Ionicons
					name="menu-outline"
					size={FAB_MENU_ICON_SIZE}
					color={APP_FONT.MONTSERRAT_BODY}
				/>
			}
		/>
	);
});

export default SidebarToggleModule;
