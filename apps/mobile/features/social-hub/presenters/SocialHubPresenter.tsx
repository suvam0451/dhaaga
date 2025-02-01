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
import { View } from 'react-native';

function SocialHubPresenter() {
	const { theme } = useAppTheme();
	const { profiles, loadNext, loadPrev, pageIndex } = useHub();

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
		if (profiles.length === 0) return <View />;
		// TODO handle index out of bounds (when deleting accts/profiles)
		return <SocialHubTabPresenter profile={profiles[pageIndex]} />;
	}, [profiles, pageIndex]);

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
