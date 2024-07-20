import { memo } from 'react';
import AppSidebarCore, { SIDEBAR_VARIANT } from '../shared/sidebar/Core';
import { FAB_MENU_MODULES } from '../../types/app.types';
import FabMenuCore from '../shared/fab/Core';

type WithAppMenuProps = {
	children: any;
	sidebarVariant: SIDEBAR_VARIANT;
	fabMenuItems: FAB_MENU_MODULES[];
};

const WithAppMenu = memo(function Foo({
	sidebarVariant,
	fabMenuItems,
	children,
}: WithAppMenuProps) {
	return (
		<AppSidebarCore variant={sidebarVariant}>
			{children}
			<FabMenuCore menuItems={fabMenuItems} />
		</AppSidebarCore>
	);
});

export default WithAppMenu;
