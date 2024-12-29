import WithDiscoverTabCtx from '../../../components/context-wrappers/WithDiscoverTabCtx';
import DiscoverTabFactory from '../../../components/screens/search/stack/landing/fragments/DiscoverTabFactory';
import {
	useAppAcct,
	useAppTheme,
} from '../../../hooks/utility/global-state-extractors';
import AppNoAccount from '../../../components/error-screen/AppNoAccount';
import AppTabLandingNavbar, {
	APP_LANDING_PAGE_TYPE,
} from '../../../components/shared/topnavbar/AppTabLandingNavbar';
import {
	Pressable,
	View,
	StyleSheet,
	TextInput,
	Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { APP_ROUTING_ENUM } from '../../../utils/route-list';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
	interpolate,
	Extrapolation,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import DiscoverSearchHelper, {
	Multiselect,
} from '../../../components/screens/search/stack/landing/fragments/DiscoverSearchHelper';
import { APP_FONTS } from '../../../styles/AppFonts';
import { useState } from 'react';
import { APP_SEARCH_TYPE } from '../../../states/reducers/discover-tab.reducer';

function Header() {
	return (
		<AppTabLandingNavbar
			type={APP_LANDING_PAGE_TYPE.DISCOVER}
			menuItems={[
				{
					iconId: 'user-guide',
					onPress: () => {
						router.navigate(APP_ROUTING_ENUM.GUIDE_DISCOVER_TAB);
					},
				},
			]}
		/>
	);
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const SIZE = 600;
const BUTTON_SIZE = 50;
const ANGLE_STEP = 40;

const actionButtons = [
	{ iconName: 'home', color: '#4CAF50' },
	{ iconName: 'settings', color: '#FF9800' },
	{ iconName: 'users', color: '#2196F3' },
];

const FloatingButtonCircular = () => {
	const isRotated = useSharedValue(0);
	const MAX_WIDTH = Dimensions.get('window').width;
	const CONTAINER_PADDING = 24;
	const WIDGET_MAX_WIDTH = MAX_WIDTH - CONTAINER_PADDING * 2;

	const [IsWidgetExpanded, setIsWidgetExpanded] = useState(false);
	const rotation = useSharedValue(0);
	const containerWidth = useSharedValue(0);
	const containerHeight = useSharedValue(64);
	const containerBorderRadius = useSharedValue(16);

	const toggleVisibility = () => {};

	const toggleMenu = () => {
		setIsWidgetExpanded(!IsWidgetExpanded);
		if (isRotated.value === 0) {
			rotation.value = withTiming(45, { duration: 200 });
			isRotated.value = withTiming(1, { duration: 300 });
			containerWidth.value = withTiming(WIDGET_MAX_WIDTH, { duration: 200 });
		} else {
			rotation.value = withTiming(0, { duration: 200 });
			containerWidth.value = withTiming(64, { duration: 200 });
			isRotated.value = withTiming(0, { duration: 300 });
		}
	};

	const containerStyle = useAnimatedStyle(() => {
		return {
			width: interpolate(
				containerWidth.value,
				[64, WIDGET_MAX_WIDTH],
				[BUTTON_SIZE, WIDGET_MAX_WIDTH],
				Extrapolation.CLAMP,
			),
		};
	});

	const { theme } = useAppTheme();
	return (
		<View style={styles.root}>
			{IsWidgetExpanded && (
				<View
					style={{
						marginHorizontal: CONTAINER_PADDING,
						paddingVertical: 4,
						paddingTop: 8,
						// marginTop: 8,
						marginBottom: 8,
						borderRadius: 12,
						backgroundColor: theme.palette.menubar,
					}}
				>
					<Multiselect setSearchCategory={() => {}} />
				</View>
			)}
			<Animated.View
				style={[
					styles.button,
					containerStyle,
					{
						flexDirection: 'row',
						paddingLeft: IsWidgetExpanded ? 12 : 0,
						backgroundColor: theme.primary.a0,
						// equivalent to padding
						right: CONTAINER_PADDING,
					},
				]}
			>
				<AnimatedPressable style={{ padding: 8 }} onPress={toggleMenu}>
					<Feather name="search" color={'black'} size={25} />
				</AnimatedPressable>
				{IsWidgetExpanded && (
					<TextInput
						multiline={false}
						placeholderTextColor={'rgba(0, 0, 0, 0.64)'}
						placeholder={'Discover something new!'}
						style={[
							{
								padding: 8,
								flex: 1,
								fontFamily: APP_FONTS.INTER_500_MEDIUM,
							},
						]}
						numberOfLines={1}
					/>
				)}
			</Animated.View>
		</View>
	);
};

function WithSearchBar({ children }: any) {
	const { theme } = useAppTheme();
	const { acct } = useAppAcct();

	if (!acct) return <AppNoAccount tab={APP_LANDING_PAGE_TYPE.DISCOVER} />;

	return (
		<View style={{ height: '100%', backgroundColor: theme.palette.bg }}>
			{children}
			<FloatingButtonCircular />
			{/*<DiscoverSearchHelper />*/}
		</View>
	);
}

export default function Tab() {
	return (
		<WithDiscoverTabCtx>
			<WithSearchBar>
				<DiscoverTabFactory Header={<Header />} />
			</WithSearchBar>
		</WithDiscoverTabCtx>
	);
}

const styles = StyleSheet.create({
	root: {
		position: 'absolute',
		bottom: 28,
		width: '100%',
	},

	container: {
		flexDirection: 'row',
		zIndex: 5,
		// borderRadius: SIZE / 2,
		// backgroundColor: 'rgba(1,123,254,0.8)',
		// justifyContent: 'center',
		// alignItems: 'center',
		// position: 'absolute',
	},
	button: {
		width: BUTTON_SIZE,
		height: BUTTON_SIZE,
		borderRadius: BUTTON_SIZE / 2,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(1,123,254,1)',
		// position

		alignSelf: 'flex-end',
	},
	actionButton: {
		width: BUTTON_SIZE,
		height: BUTTON_SIZE,
		borderRadius: BUTTON_SIZE / 2,
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
	},
});
