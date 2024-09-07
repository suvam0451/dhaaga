import { useFabController } from './hooks/useFabController';
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from 'react-native-reanimated';
import { Fragment, memo, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { APP_FONT } from '../../../styles/AppTheme';
import { FAB_MENU_MODULES } from '../../../types/app.types';
import NavigatorModule from './modules/Navigator';
import SidebarToggleModule from './modules/SidebarToggle';
import CreatePostModule from './modules/CreatePost';
import TimelineSwitcherModule from './modules/TimelineSwitcher';
import { styles } from './fab.styles';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';

const Y_OFFSET_MENU_ITEM = 72;

type Props = {
	menuItems: FAB_MENU_MODULES[];
};

/**
 * A FAB button
 * @constructor
 */
const FabMenuCore = memo(function Foo({ menuItems }: Props) {
	const { activeMenu, isFabExpanded, setIsFabExpanded } = useFabController();

	const rotation = useSharedValue(0);
	const displacementY = useSharedValue(0);

	const toggleMenuOpenStatus = useCallback(() => {
		rotation.value = withTiming(
			rotation.value + 360,
			{ duration: 200, easing: Easing.linear },
			() => {
				rotation.value = 0; // Reset rotation value after completing 360 degrees
			},
		);

		if (isFabExpanded) {
			displacementY.value = withTiming(0, { duration: 360 });
		} else {
			displacementY.value = withSpring(-Y_OFFSET_MENU_ITEM);
		}

		setIsFabExpanded((isFabExpanded) => !isFabExpanded);
	}, [isFabExpanded]);

	// @ts-ignore
	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ rotate: `${rotation.value}deg` }],
		};
	});

	function onClick() {
		toggleMenuOpenStatus();
	}

	const MenuItems = useMemo(() => {
		return menuItems.map((o, i) => {
			switch (o) {
				case FAB_MENU_MODULES.NAVIGATOR:
					return <NavigatorModule key={i} index={i} />;
				case FAB_MENU_MODULES.OPEN_SIDEBAR:
					return <SidebarToggleModule key={i} index={i} />;
				case FAB_MENU_MODULES.CREATE_POST:
					return <CreatePostModule key={i} index={i} />;
				case FAB_MENU_MODULES.TIMELINE_SWITCHER:
					return <TimelineSwitcherModule key={i} index={i} />;
				default:
					return <View key={i} />;
			}
		});
	}, [menuItems]);

	return (
		<Fragment>
			<Animated.View
				style={[
					styles.widgetContainerCollapsed,
					animatedStyle,
					{
						display: activeMenu === 'drawer' ? 'none' : 'flex',
					},
				]}
				onTouchStart={onClick}
			>
				<View
					style={[
						{
							display: 'flex',
							flexDirection: 'row',
							width: '100%',
							justifyContent: 'center',
							padding: 12,
							paddingVertical: 16,
						},
					]}
				>
					<View style={[{ width: 24 }]}>
						{/*<MaterialIcons*/}
						{/*	name="more-vert"*/}
						{/*	size={24}*/}
						{/*	color={APP_FONT.MONTSERRAT_BODY}*/}
						{/*/>*/}
						<SimpleLineIcons
							name="options-vertical"
							size={24}
							color={APP_FONT.MONTSERRAT_BODY}
						/>
					</View>
				</View>
			</Animated.View>
			{MenuItems}
		</Fragment>
	);
});

export default FabMenuCore;
