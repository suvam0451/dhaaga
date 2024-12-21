import { useAppDrawerContext } from '../../states/useAppDrawer';
import { View } from 'react-native';
import { useAssets } from 'expo-asset';
import { useEffect, useState } from 'react';
import { useFabController } from '../shared/fab/hooks/useFabController';

type Props = {
	children: any;
};

/**
 * Drawer content for "Known Servers"
 * module.
 *
 * Requires AppDrawerContext
 */
function KnownServersDrawer({ children }: Props) {
	const { open, setOpen } = useAppDrawerContext();
	const { setActiveMenu } = useFabController();

	useEffect(() => {
		setActiveMenu(open ? 'drawer' : 'fab');
	}, [open]);

	const [assets, error] = useAssets([require('../../assets/bmc-button.png')]);

	const [IsAssetsLoaded, setIsAssetsLoaded] = useState(false);
	useEffect(() => {
		setIsAssetsLoaded(!error && assets?.every((o) => o?.downloaded));
	}, [assets, error]);

	return <View>{children}</View>;
}

export default KnownServersDrawer;
