import { memo, useEffect, useMemo, useRef, useState } from 'react';
import {
	Dimensions,
	Image as RNImage,
	LayoutChangeEvent,
	View,
} from 'react-native';
import {
	AltTextOverlay,
	AppAudioComponent,
	AppImageComponent,
	AppVideoComponent,
	CarousalIndicatorOverlay,
} from '../_shared';
import {
	MARGIN_TOP,
	MEDIA_CONTAINER_MAX_HEIGHT,
	MEDIA_CONTAINER_WIDTH,
} from '../_common';
import {
	Directions,
	FlingGestureHandlerEventPayload,
	Gesture,
	GestureDetector,
	GestureStateChangeEvent,
} from 'react-native-gesture-handler';
import useCircularList from '../state/useCircularList';
import MediaService from '../../../../services/media.service';

export type AppImageCarouselItem = {
	src: string;
	type: string;
	altText?: string;
	blurhash?: string;
};

export type AppImageCarouselData = {
	items: AppImageCarouselItem[];
	calculatedHeight: number;
	timelineCacheId: string;
	leftMarginAdjustment?: number;
};

const AppImageCarouselItem = memo(function Foo({
	src,
	type,
	blurhash,
	calculatedHeight,
	width,
	leftMarginAdjustment,
}: AppImageCarouselItem & {
	calculatedHeight: number;
	leftMarginAdjustment?: number;
	width: number;
}) {
	const MediaItem = useMemo(() => {
		switch (type) {
			case 'image':
			case 'image/jpeg':
			case 'image/png':
			case 'image/webp': {
				return (
					<AppImageComponent
						url={src}
						blurhash={blurhash}
						height={calculatedHeight}
						width={width}
						leftMarginAdjustment={leftMarginAdjustment}
					/>
				);
			}
			case 'video':
			case 'video/mp4':
			case 'video/webm':
			case 'video/quicktime': {
				return (
					<AppVideoComponent
						type={'video'}
						url={src}
						height={calculatedHeight}
					/>
				);
			}
			case 'gifv':
			case 'image/gif': {
				return (
					<AppVideoComponent
						type={'gifv'}
						url={src}
						height={calculatedHeight}
						loop
					/>
				);
			}
			case 'audio':
			case 'audio/mpeg': {
				return <AppAudioComponent url={src} />;
			}
			default: {
				console.log('[WARN]: unsupported media type', type);
				return <View></View>;
			}
		}
	}, [src, type, calculatedHeight]);

	return (
		<View
			style={{
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center',
				width: MEDIA_CONTAINER_WIDTH,
				height: type === 'audio' ? 48 : calculatedHeight,
				position: 'relative',
				marginTop: MARGIN_TOP,
			}}
		>
			{MediaItem}
		</View>
	);
});

const AppImageCarousel = memo(function AppImageCarouselFoo({
	calculatedHeight,
	items,
	timelineCacheId,
	leftMarginAdjustment,
}: AppImageCarouselData) {
	// set width
	const [Width, setWidth] = useState(Dimensions.get('window').width);
	function onLayoutChanged(event: LayoutChangeEvent) {
		const { width } = event.nativeEvent.layout;
		setWidth(width);
	}

	const start =
		useRef<GestureStateChangeEvent<FlingGestureHandlerEventPayload>>();
	const end =
		useRef<GestureStateChangeEvent<FlingGestureHandlerEventPayload>>();

	const { Pointer, onPrev, onNext } = useCircularList(
		items.length,
		timelineCacheId,
	);
	const item = items[Pointer];

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

	// console.log('carousal height', calculatedHeight);
	return (
		<GestureDetector gesture={fling}>
			<View
				style={{
					width: Width,
					height: calculatedHeight,
					alignItems: 'center',
					justifyContent: 'center',
					position: 'relative',
				}}
				onLayout={onLayoutChanged}
			>
				<AppImageCarouselItem
					src={item.src}
					type={item.type}
					blurhash={item.blurhash}
					// FIXME: make this value be calculated properly
					width={Width - 20}
					calculatedHeight={calculatedHeight}
					leftMarginAdjustment={leftMarginAdjustment}
				/>
				<CarousalIndicatorOverlay
					index={Pointer}
					totalCount={items.length}
					top={8}
					right={0}
				/>
				<AltTextOverlay altText={item.altText} />
			</View>
		</GestureDetector>
	);
});

export default AppImageCarousel;
