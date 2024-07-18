import { memo } from 'react';
import * as React from 'react';
import AppSidebarCore from '../Core';
import { View } from 'react-native';
import Coffee from '../../../static/sponsorship/Coffee';
import VersionCode from '../../../static/sponsorship/VersionCode';
import { useAppDrawerContext } from '../../../../states/useAppDrawer';
import { Drawer } from 'react-native-drawer-layout';
import { APP_SIDEBAR_BG_COLOR, APP_SIDEBAR_PADDING } from '../sidebar.settings';

type AppSidebarFactoryProps = {
	PageActions: React.JSX.Element;
	children: React.ReactNode;
};

const AppSidebarFactory = memo(function Foo({
	PageActions,
	children,
}: AppSidebarFactoryProps) {
	const { open, setOpen } = useAppDrawerContext();

	return (
		<Drawer
			open={open}
			onOpen={() => setOpen(true)}
			onClose={() => setOpen(false)}
			drawerPosition={'right'}
			renderDrawerContent={() => (
				<View
					style={{
						backgroundColor: APP_SIDEBAR_BG_COLOR,
						padding: APP_SIDEBAR_PADDING,
						height: '100%',
					}}
				>
					<View style={{ flexGrow: 1 }}>{PageActions}</View>
					<View>
						<Coffee />
						<VersionCode />
					</View>
				</View>
			)}
		>
			{children}
		</Drawer>
	);
});

export default AppSidebarFactory;
