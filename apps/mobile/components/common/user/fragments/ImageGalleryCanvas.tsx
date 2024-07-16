import { Dimensions, Animated } from 'react-native';
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

function ImageGalleryCanvas({
	src,
	alt,
	onNext,
	onPrev,
	height,
	width,
}: Props) {
	// function onClose() {
	// 	console.log('close');
	// }

	// const renderLeftActions = (progress, dragX) => {
	// 	const trans = dragX.interpolate({
	// 		inputRange: [0, 50, 100, 101],
	// 		outputRange: [-20, 0, 0, 1],
	// 	});
	// 	return (
	// 		<RectButton
	// 			onPress={onClose}
	// 			style={{
	// 				display: 'flex',
	// 				alignItems: 'center',
	// 				justifyContent: 'center',
	// 				marginHorizontal: 8,
	// 			}}
	// 		>
	// 			<Animated.View>
	// 				<Animated.View style={{ width: 24 }}>
	// 					<FontAwesome
	// 						name="chevron-left"
	// 						size={24}
	// 						color={APP_FONT.MONTSERRAT_BODY}
	// 					/>
	// 				</Animated.View>
	// 				<Animated.Text
	// 					style={[
	// 						{
	// 							transform: [{ translateX: trans }],
	// 							color: APP_FONT.MONTSERRAT_BODY,
	// 						},
	// 					]}
	// 				>
	// 					Last
	// 				</Animated.Text>
	// 			</Animated.View>
	// 		</RectButton>
	// 	);
	// };

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
		const data = MediaService.calculateDimensions({
			maxW: maxW.current,
			maxH: 400,
			H: height,
			W: width,
		});
		console.log(data);
		return data;
	}, [height, width]);

	return (
		<GestureDetector gesture={fling}>
			<Animated.View
				style={{
					width: maxW.current,
					height: 400,
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'center',
					paddingHorizontal: 8,
					borderRadius: 8,
				}}
			>
				{/*@ts-ignore-next-line*/}
				<Image
					source={{ uri: src }}
					style={{
						flex: 1,
						width: _width,
						height: _height,
						opacity: 0.87,
						borderRadius: 8,
					}}
				/>
			</Animated.View>
		</GestureDetector>
	);
}

export default ImageGalleryCanvas;
