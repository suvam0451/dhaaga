import { FAB_MENU_ICON_SIZE, FabModuleProps } from './_common';
import { memo, useCallback } from 'react';
import { FabMenuItemFactory } from '../fragments/FabMenuItemFactory';
import { FabMenuItemText } from '../fragments/FabMenuItemIcon';
import { APP_FONT } from '../../../../styles/AppTheme';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useTimelineController } from '../../../../states/useTimelineController';
import { useFabController } from '../hooks/useFabController';

const MENU_ITEM_LABEL = 'Switch Timeline';

const TimelineSwitcherModule = memo(({ index }: FabModuleProps) => {
	const { setShowTimelineSelection } = useTimelineController();
	const { setIsFabExpanded } = useFabController();

	const onClick = useCallback(() => {
		try {
			setShowTimelineSelection(true);
			setIsFabExpanded(false);
		} catch (e) {
			console.log(
				'[WARN]: timeline switcher context is not hooked to the fab menu',
			);
		}
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
