import { FAB_MENU_ICON_SIZE, FabModuleProps } from './_common';
import { memo, useCallback } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { APP_FONT } from '../../../../styles/AppTheme';
import { FabMenuItemText } from '../fragments/FabMenuItemIcon';
import { FabMenuItemFactory } from '../fragments/FabMenuItemFactory';

const MENU_ITEM_LABEL = 'Navigator';

const NavigatorModule = memo(({ index }: FabModuleProps) => {
	const onClick = useCallback(() => {
		console.log('navigator clicked...');
	}, []);

	return (
		<FabMenuItemFactory
			index={index}
			onClick={onClick}
			IconComponent={
				<Ionicons
					name="navigate"
					size={FAB_MENU_ICON_SIZE}
					color={APP_FONT.MONTSERRAT_BODY}
				/>
			}
			TextComponent={<FabMenuItemText label={MENU_ITEM_LABEL} />}
		/>
	);
});

export default NavigatorModule;
