import { useMemo, useRef } from 'react';
import {
	useAppTheme,
	useHub,
} from '../../../hooks/utility/global-state-extractors';
import {
	Directions,
	FlingGestureHandlerEventPayload,
	Gesture,
	GestureDetector,
	GestureStateChangeEvent,
} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import SocialHubTabPresenter from './SocialHubTabPresenter';

function SocialHubPresenter() {
	const { theme } = useAppTheme();
	const { accounts, loadNext, loadPrev, navigation } = useHub();

	const start =
		useRef<GestureStateChangeEvent<FlingGestureHandlerEventPayload>>();
	const end =
		useRef<GestureStateChangeEvent<FlingGestureHandlerEventPayload>>();

	function onFlingGesture() {
		if (start.current.absoluteX > end.current.absoluteX) {
			loadNext();
		} else {
			loadPrev();
		}
	}

	const fling = Gesture.Fling()
		.direction(Directions.LEFT | Directions.RIGHT)
		.onBegin((event) => {
			start.current = event;
		})
		.onEnd((event) => {
			end.current = event;
			onFlingGesture();
		})
		.runOnJS(true);

	const HubComponent = useMemo(() => {
		// TODO handle index out of bounds (when deleting accts/profiles)
		return (
			<SocialHubTabPresenter
				profile={
					accounts[navigation.accountIndex].profiles[navigation.profileIndex]
				}
			/>
		);
	}, [accounts, navigation]);

	return (
		<GestureDetector gesture={fling}>
			<Animated.View
				style={{ backgroundColor: theme.palette.bg, height: '100%' }}
			>
				{HubComponent}
			</Animated.View>
		</GestureDetector>
	);
}

export default SocialHubPresenter;
