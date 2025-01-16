import { Animated, Dimensions, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import {
	Directions,
	FlingGestureHandlerEventPayload,
	Gesture,
	GestureDetector,
	GestureStateChangeEvent,
} from 'react-native-gesture-handler';
import { useMemo, useRef } from 'react';
import MediaService from '../../../../services/media.service';

type Props = {
	src: string;
	alt?: string;
	width: number;
	height: number;
	onPrev: () => void;
	onNext: () => void;
};

function ImageGalleryCanvas({ src, onNext, onPrev, height, width }: Props) {
	const start =
		useRef<GestureStateChangeEvent<FlingGestureHandlerEventPayload>>();
	const end =
		useRef<GestureStateChangeEvent<FlingGestureHandlerEventPayload>>();

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

	const maxW = useRef(Dimensions.get('window').width - 16);
	const { height: _height, width: _width } = useMemo(() => {
		return MediaService.calculateDimensions({
			maxW: maxW.current,
			maxH: 400,
			H: height,
			W: width,
		});
	}, [height, width]);

	return (
		<GestureDetector gesture={fling}>
			<Animated.View style={styles.rootView}>
				{/*@ts-ignore-next-line*/}
				<Image
					source={{ uri: src }}
					style={{
						flex: 1,
						width: _width,
						height: _height,
						borderRadius: 8,
					}}
				/>
			</Animated.View>
		</GestureDetector>
	);
}

export default ImageGalleryCanvas;

const styles = StyleSheet.create({
	rootView: {
		width: '100%', // need to adjust based on available screen space
		height: 420,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
