import { FAB_MENU_ICON_SIZE, FabModuleProps } from './_common';
import { memo, useCallback } from 'react';
import { FabMenuItemFactory } from '../fragments/FabMenuItemFactory';
import { FabMenuItemText } from '../fragments/FabMenuItemIcon';
import { APP_FONT } from '../../../../styles/AppTheme';
import AntDesign from '@expo/vector-icons/AntDesign';

const MENU_ITEM_LABEL = 'Switch Timeline';

const TimelineSwitcherModule = memo(({ index }: FabModuleProps) => {
	const onClick = useCallback(() => {
		console.log('timeline switcher clicked...');
	}, []);

	return (
		<FabMenuItemFactory
			index={index}
			onClick={onClick}
			TextComponent={<FabMenuItemText label={MENU_ITEM_LABEL} />}
			IconComponent={
				<AntDesign
					name="switcher"
					size={FAB_MENU_ICON_SIZE}
					color={APP_FONT.MONTSERRAT_BODY}
				/>
			}
		/>
	);
});

export default TimelineSwitcherModule;
