import { AppText } from '#/components/lib/Text';
import { View } from 'react-native';
import Animated, {
	interpolateColor,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import MailArt from '#/components/svgs/Mail';
import PartyPopperArt from '#/components/svgs/PartyPopper';
import BearRoadSign from '#/components/svgs/BearRoadSign';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { useAppTheme } from '#/hooks/utility/global-state-extractors';
import { useEffect, useRef, useState } from 'react';
import {
	Directions,
	FlingGestureHandlerEventPayload,
	Gesture,
	GestureDetector,
	GestureStateChangeEvent,
} from 'react-native-gesture-handler';

const AUTOPLAY_INTERVAL = 10000;

const DISPLAY_ITEMS = [
	{
		title: 'A Focus on Fun',
		desc: 'Dhaaga makes the internet fun to use, with a user-first approach and emphasis on simplicity and fun.',
		art: <PartyPopperArt />,
	},
	{
		title: 'Cozy Home Page',
		desc: "Decorate your home page to your heart's content. Pin your favourite destinations close. Pin your friends even closer.",
		art: <BearRoadSign />,
	},
	{
		title: 'Hub Profiles',
		desc: 'Organise your interests and ideas into separate profiles. Each profile can be personalised independently!',
		art: <BearRoadSign />,
	},
	{
		title: 'A Cleaner Inbox',
		desc: 'Clean separation of various types of notifications, with specialised user interface to interact with each of them!',
		art: <MailArt />,
	},
];
function WelcomeScreenFeatureShowcase() {
	const intervalRef = useRef<number | null>(null);
	const { theme } = useAppTheme();
	const [Index, setIndex] = useState(0);
	// Shared value for animation
	const animatedIndex = useSharedValue(0);

	// Function to start the autoplay interval
	const startAutoplay = () => {
		if (intervalRef.current) clearInterval(intervalRef.current);

		intervalRef.current = setInterval(() => {
			setIndex((prev) => (prev + 1) % DISPLAY_ITEMS.length);
		}, AUTOPLAY_INTERVAL);
	};

	// Update index every 2 seconds
	useEffect(() => {
		startAutoplay();
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [DISPLAY_ITEMS.length]);

	// Animate shared value whenever index changes
	useEffect(() => {
		animatedIndex.value = withTiming(Index, { duration: 250 });
	}, [Index]);

	const start =
		useRef<GestureStateChangeEvent<FlingGestureHandlerEventPayload>>(null);
	const end =
		useRef<GestureStateChangeEvent<FlingGestureHandlerEventPayload>>(null);

	function ranOnJs() {
		if (start.current.absoluteX > end.current.absoluteX) {
			setIndex((prev) => (prev + 1) % DISPLAY_ITEMS.length);
		} else {
			setIndex(
				(prev) => (prev - 1 + DISPLAY_ITEMS.length) % DISPLAY_ITEMS.length,
			);
		}
		startAutoplay();
	}

	const fling = Gesture.Fling()
		.direction(Directions.LEFT | Directions.RIGHT)
		.onBegin((event) => {
			start.current = event;
		})
		.onEnd((event) => {
			end.current = event;
			scheduleOnRN(ranOnJs);
		});

	return (
		<GestureDetector gesture={fling}>
			<View>
				<View style={{ flexDirection: 'row', height: 136, width: '100%' }}>
					<View style={{ flex: 1, marginRight: 12 }}>
						<AppText.SemiBold
							emphasis={APP_COLOR_PALETTE_EMPHASIS.A0}
							style={{ fontSize: 24 }}
						>
							{DISPLAY_ITEMS[Index].title}
						</AppText.SemiBold>
						<AppText.Normal
							style={{ marginTop: 4, fontSize: 16 }}
							emphasis={APP_COLOR_PALETTE_EMPHASIS.A30}
							numberOfLines={5}
						>
							{DISPLAY_ITEMS[Index].desc}
						</AppText.Normal>
					</View>
					<View style={{ width: 84 }}>{DISPLAY_ITEMS[Index].art}</View>
				</View>

				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'center',
						marginTop: 8,
					}}
				>
					{Array.from({ length: DISPLAY_ITEMS.length }).map((_, i) => {
						const animatedStyle = useAnimatedStyle(() => {
							const width = withTiming(
								i === Math.round(animatedIndex.value) ? 32 : 20,
								{ duration: 500 },
							);

							const backgroundColor = interpolateColor(
								animatedIndex.value,
								[i - 1, i, i + 1],
								[theme.secondary.a50, theme.primary.a10, theme.secondary.a50],
							);

							return { width, backgroundColor };
						});

						return (
							<Animated.View
								key={i}
								style={[
									{ height: 3, marginHorizontal: 2, borderRadius: 16 },
									animatedStyle,
								]}
							/>
						);
					})}
				</View>
			</View>
		</GestureDetector>
	);
}

export default WelcomeScreenFeatureShowcase;
