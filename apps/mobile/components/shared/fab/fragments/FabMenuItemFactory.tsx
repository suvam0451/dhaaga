import { memo } from 'react';
import * as React from 'react';
import useFabMenuItemAnim from '../hooks/useFabMenuItemAnim';
import { useFabController } from '../hooks/useFabController';
import { View } from 'react-native';
import { FabMenuItemIcon } from './FabMenuItemIcon';
import Animated from 'react-native-reanimated';
import { styles } from '../fab.styles';

type FabMenuItemFactoryProps = {
	index: number;
	onClick: () => void;
	TextComponent: React.JSX.Element;
	IconComponent: React.JSX.Element;
};

export const FabMenuItemFactory = memo(function Foo({
	IconComponent,
	TextComponent,
	onClick,
	index,
}: FabMenuItemFactoryProps) {
	const { activeMenu, isFabExpanded } = useFabController();
	const { textAnim, divAnim } = useFabMenuItemAnim(index, isFabExpanded);

	if (activeMenu === 'drawer') return <View></View>;

	return (
		<Animated.View
			style={[styles.widgetContainerCollapsedCore, divAnim]}
			onTouchEnd={onClick}
		>
			<FabMenuItemIcon Icon={IconComponent} />
			<Animated.View style={[textAnim]}>{TextComponent}</Animated.View>
		</Animated.View>
	);
});
