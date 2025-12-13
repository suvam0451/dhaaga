import {
	Dimensions,
	Pressable,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import {
	NativeTextMedium,
	NativeTextNormal,
	NativeTextSemiBold,
	NativeTextSpecial,
} from '#/ui/NativeText';
import NavBar_Simple from '#/components/shared/topnavbar/NavBar_Simple';
import { useAppTheme } from '#/states/global/hooks';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import FreePlanLabel from '#/components/svgs/plans/FreePlanLabel';
import SupporterPlanLabel from '#/components/svgs/plans/SupporterPlanLabel';
import BetaPlanLabel from '#/components/svgs/plans/BetaPlanLabel';
import FlyingMoney from '#/components/svgs/plans/FlyingMoney';
import FreePlanOverview from '#/features/purchase-plans/components/FreePlanOverview';
import PagerView from 'react-native-pager-view';
import BetaPlanOverview from '#/features/purchase-plans/components/BetaPlanOverview';
import Animated, {
	clamp,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withTiming,
	runOnJS,
} from 'react-native-reanimated';
import ProCrown from '#/components/svgs/plans/free/ProCrown';
import { useRef } from 'react';

const AnimatedText = Animated.createAnimatedComponent(NativeTextMedium);
const AnimatedNativeTextSemiBold =
	Animated.createAnimatedComponent(NativeTextSemiBold);
type HighlightItem =
	| { type: 'feature'; title: string; description: string; Icon: any }
	| {
			type: 'divider';
	  };

function BetaPageContent() {
	const { theme } = useAppTheme();

	const featureList: HighlightItem[] = [
		{
			type: 'feature',
			title: 'Free Services',
			description: 'Everything from all paid tirs',
			Icon: <FlyingMoney />,
		},
	];
	return (
		<>
			<NativeTextSpecial
				style={{ fontSize: 32, marginTop: 32, color: theme.primary }}
			>
				INCLUDES
			</NativeTextSpecial>
		</>
	);
}

function SupporterPageContent() {}

function ProPageContent() {}

const FIXED_CARD_MAX_HEIGHT = 192;
const COLLAPSED_CARD_HEIGHT = 88;

function Page() {
	const { theme } = useAppTheme();

	const ref = useRef<ScrollView | null>(null);
	const pagerOffset = useSharedValue(0);
	const isCollapsed = useSharedValue(0);

	function resetScroll() {
		ref.current?.scrollTo({ x: 0, animated: true });
	}
	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (event) => {
			pagerOffset.value = event.contentOffset.y;
			if (!isCollapsed.value && pagerOffset.value > 16) {
				runOnJS(resetScroll)();
				isCollapsed.value = 1;
			} else if (isCollapsed.value && pagerOffset.value === 0) {
				isCollapsed.value = withDelay(200, withTiming(0));
			}
		},
	});

	function onCardPress() {
		// isCollapsed.value = 0;
	}

	const animatedStyle = useAnimatedStyle(() => {
		return {
			height: withTiming(
				isCollapsed.value ? COLLAPSED_CARD_HEIGHT : FIXED_CARD_MAX_HEIGHT,
				{
					duration: 200,
				},
			),
		};
	});

	const cardStyle = useAnimatedStyle(() => {
		return {
			minWidth: withTiming(isCollapsed.value ? 48 : 128, {
				duration: 400,
			}),
		};
	});

	const viewStyle = useAnimatedStyle(() => {
		return {
			display: isCollapsed.value ? 'none' : 'flex',
		};
	});

	const animatedPagerViewStyle = useAnimatedStyle(() => {
		return {
			marginTop: withTiming(
				isCollapsed.value ? 148 : FIXED_CARD_MAX_HEIGHT + 16,
				{
					duration: 200,
				},
			),
		};
	});

	return (
		<View
			style={{
				flex: 1,
				backgroundColor: theme.background.a0,
				paddingTop: 52 + 16,
			}}
		>
			<NavBar_Simple label={'Plans'} />
			<Animated.View
				style={[
					{
						position: 'absolute',
						backgroundColor: theme.background.a0,
						marginTop: 52,
						overflow: 'hidden',
						zIndex: 100,
					},
					animatedStyle,
				]}
			>
				<ScrollView
					ref={ref}
					style={{
						backgroundColor: theme.background.a20,
						minWidth: Dimensions.get('window').width,
					}}
					contentContainerStyle={{
						paddingBottom: 8,
						// width: '100%',
						paddingTop: 4,
					}}
					horizontal={true}
					showsHorizontalScrollIndicator={false}
				>
					<Animated.View style={[cardStyle]}>
						<TouchableOpacity
							style={[
								styles.card,
								{
									alignItems: 'center',
									borderColor: theme.primary,
									backgroundColor: theme.background.a40,
									marginRight: 12,
								},
							]}
							onPress={onCardPress}
						>
							<AnimatedNativeTextSemiBold
								style={[
									{ fontSize: 20, marginBottom: 8, textAlign: 'center' },
									viewStyle,
								]}
							>
								Free
							</AnimatedNativeTextSemiBold>
							<FreePlanLabel size={48} />
							<AnimatedText
								style={[{ textAlign: 'center', marginTop: 12 }, viewStyle]}
								emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
							>
								Free Forever. No take backsies.
							</AnimatedText>
						</TouchableOpacity>
					</Animated.View>

					<Animated.View style={[cardStyle]}>
						<TouchableOpacity
							style={[
								styles.card,
								{
									alignItems: 'center',
									borderColor: theme.primary,
									backgroundColor: theme.background.a40,
									marginRight: 12,
								},
							]}
							onPress={onCardPress}
						>
							<AnimatedNativeTextSemiBold
								style={[
									{
										fontSize: 20,
										marginBottom: 10,
										textAlign: 'center',
									},
									viewStyle,
								]}
							>
								Beta
							</AnimatedNativeTextSemiBold>
							<View style={{ width: 48, height: 48 }}>
								<BetaPlanLabel size={48} />
							</View>
							<AnimatedText
								style={[{ marginTop: 12, textAlign: 'center' }, viewStyle]}
								emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
							>
								Everything is free while my wallet lasts, xD
							</AnimatedText>
						</TouchableOpacity>
					</Animated.View>
					<Animated.View style={[cardStyle]}>
						<TouchableOpacity
							style={[
								styles.card,
								{
									alignItems: 'center',
									borderColor: theme.primary,
									backgroundColor: theme.background.a40,
									marginRight: 12,
								},
							]}
							onPress={onCardPress}
						>
							<AnimatedNativeTextSemiBold
								style={[
									{ fontSize: 20, marginBottom: 10, textAlign: 'center' },
									viewStyle,
								]}
							>
								Supporter
							</AnimatedNativeTextSemiBold>
							<View style={{ width: 48, height: 48 }}>
								<SupporterPlanLabel />
							</View>
							<AnimatedText
								style={[{ marginTop: 10, textAlign: 'center' }, viewStyle]}
								emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
							>
								If you like the app, consider buying it!
							</AnimatedText>
						</TouchableOpacity>
					</Animated.View>
					<Animated.View style={[cardStyle]}>
						<TouchableOpacity
							style={[
								styles.card,
								{
									alignItems: 'center',
									borderColor: theme.primary,
									backgroundColor: theme.background.a40,
									marginRight: 12,
								},
							]}
							onPress={onCardPress}
						>
							<AnimatedNativeTextSemiBold
								style={[
									{ fontSize: 20, marginBottom: 10, textAlign: 'center' },
									viewStyle,
								]}
							>
								Plus/Pro
							</AnimatedNativeTextSemiBold>
							<View style={{ width: 48, height: 48 }}>
								<ProCrown />
							</View>

							<AnimatedText
								style={[{ marginTop: 10, textAlign: 'center' }, viewStyle]}
								emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
							>
								Extra tools for power users.
							</AnimatedText>
						</TouchableOpacity>
					</Animated.View>
				</ScrollView>
			</Animated.View>
			<FreePlanOverview
				scrollHandler={scrollHandler}
				key={0}
				animatedHeaderStyle={animatedPagerViewStyle}
			/>
			{/*<Animated.View style={[animatedPagerViewStyle]} />*/}
			{/*<PagerView style={{ flex: 1 }} initialPage={TabIndex}>*/}

			{/*	/!*<View key={1} style={{ flex: 1 }}>*!/*/}
			{/*	/!*	<BetaPlanOverview key={1} />*!/*/}
			{/*	/!*</View>*!/*/}
			{/*</PagerView>*/}
		</View>
	);
}

export default Page;

const styles = StyleSheet.create({
	card: {
		paddingVertical: 12,
		paddingHorizontal: 10,
		borderRadius: 8,
		borderWidth: 2,
		maxWidth: 128,
	},
});
