import { FAB_MENU_MODULES } from '../../types/app.types';
import FabMenuCore from '../shared/fab/Core';

type WithAppMenuProps = {
	children: any;
	fabMenuItems: FAB_MENU_MODULES[];
};

function WithAppMenu({ fabMenuItems, children }: WithAppMenuProps) {
	return (
		<>
			{children}
			<FabMenuCore menuItems={fabMenuItems} />
		</>
	);
}

export default WithAppMenu;
