import { useRef, useState } from 'react';
import {
	Directions,
	FlingGestureHandlerEventPayload,
	Gesture,
	GestureStateChangeEvent,
} from 'react-native-gesture-handler';
import CanvasView from '../views/CanvasView';
import { Dimensions, LayoutChangeEvent, View } from 'react-native';
import { MEDIA_CONTAINER_MAX_HEIGHT } from '../../../../../components/common/media/_common';

type Props = {
	src: string;
	alt?: string;
	width: number;
	height: number;
	onPrev: () => void;
	onNext: () => void;
};

const MARGIN_HORIZONTAL = 10;

function CanvasPresenter({ src, onNext, onPrev, height, width }: Props) {
	const start =
		useRef<GestureStateChangeEvent<FlingGestureHandlerEventPayload>>();
	const end =
		useRef<GestureStateChangeEvent<FlingGestureHandlerEventPayload>>();

	const maxW = Dimensions.get('window').width - MARGIN_HORIZONTAL * 2;

	function yoink() {
		if (start.current.absoluteX > end.current.absoluteX) {
			onNext();
		} else {
			onPrev();
		}
	}

	const fling = Gesture.Fling()
		.direction(Directions.LEFT | Directions.RIGHT)
		.onBegin((event) => {
			start.current = event;
		})
		.onEnd((event) => {
			end.current = event;
			yoink();
		})
		.runOnJS(true);

	const [ContainerHeight, setContainerHeight] = useState(
		MEDIA_CONTAINER_MAX_HEIGHT,
	);

	function onLayout(event: LayoutChangeEvent) {
		const { height } = event.nativeEvent.layout;
		setContainerHeight(Math.min(height, MEDIA_CONTAINER_MAX_HEIGHT));
	}

	return (
		<View onLayout={onLayout} style={{ flex: 1 }}>
			<CanvasView
				src={src}
				width={width}
				height={height}
				gesture={fling}
				maxW={maxW}
				maxH={ContainerHeight}
			/>
		</View>
	);
}

export default CanvasPresenter;
