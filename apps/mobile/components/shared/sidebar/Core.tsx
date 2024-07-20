import { useMemo } from 'react';
import { View } from 'react-native';
import TimelineSidebar from './variants/TimelineSidebar';

export enum SIDEBAR_VARIANT {
	TIMELINE,
}

type AppSidebarCoreProps = {
	children: any;
	variant: SIDEBAR_VARIANT;
};

function AppSidebarCore({ children, variant }: AppSidebarCoreProps) {
	return useMemo(() => {
		switch (variant) {
			case SIDEBAR_VARIANT.TIMELINE:
				return <TimelineSidebar children={children} />;
			default: {
				return <View></View>;
			}
		}
	}, [variant, children]);
}

export default AppSidebarCore;
