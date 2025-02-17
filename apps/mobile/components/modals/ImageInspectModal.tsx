import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import { Dimensions, StyleSheet, View, Text } from 'react-native';
import useGlobalState from '../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { useEffect, useState } from 'react';
import { AppMediaObject, AppPostObject } from '../../types/app-post.types';
import { Image } from 'expo-image';
import { AppIcon } from '../lib/Icon';
import { useImageAutoHeight } from '../../hooks/app/useImageDims';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../utils/theming.util';
import { APP_FONTS } from '../../styles/AppFonts';

type StatSectionProps = {
	icon: any;
	count: number;
	last?: boolean;
};

function StatSection({ icon, count, last }: StatSectionProps) {
	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);

	if (count === 0)
		return (
			<View style={{ paddingHorizontal: 4, paddingRight: last ? 0 : 16 }}>
				{icon}
			</View>
		);

	return (
		<View style={{ paddingHorizontal: 4, flexDirection: 'row' }}>
			{icon}
			<Text
				style={{
					color: theme.secondary.a20,
					fontSize: 16,
					fontFamily: APP_FONTS.INTER_500_MEDIUM,
					marginLeft: 6,
				}}
			>
				{count}
			</Text>
		</View>
	);
}

type ImageInspectPostMetricsProps = {
	post: AppPostObject;
};

function ImageInspectPostMetrics({ post }: ImageInspectPostMetricsProps) {
	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);

	const likeCount = post?.stats?.likeCount;
	const replyCount = post?.stats?.replyCount;
	const shareCount = post?.stats?.boostCount;

	return (
		<View
			style={[
				styles.imageInspectorPostMetricsContainer,
				{
					backgroundColor: theme.palette.menubar,
				},
			]}
		>
			<View style={{ flexDirection: 'row' }}>
				<StatSection
					icon={
						<AppIcon
							id={'heart'}
							size={24}
							emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
						/>
					}
					count={likeCount}
				/>

				<StatSection
					icon={
						<AppIcon
							id={'chatbox-outline'}
							size={24}
							emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
						/>
					}
					count={replyCount}
				/>
				<StatSection
					icon={
						<AppIcon
							id={'share'}
							size={24}
							emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
						/>
					}
					count={shareCount}
				/>
				<View
					style={{
						height: '100%',
						width: 2,
						backgroundColor: '#363636',
						marginHorizontal: 8,
					}}
				/>
				<StatSection
					icon={
						<AppIcon
							id={'save'}
							size={22}
							emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
						/>
					}
					count={0}
					last
				/>
			</View>
		</View>
	);
}

/**
 * Shows up when any timeline image is pressed
 * @constructor
 */
function ImageInspectModal() {
	const [Data, setData] = useState<AppMediaObject[]>([]);
	const [PostData, setPostData] = useState(null);
	const { visible, stateId, appSession, hide, theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
			visible: o.imageInspectModal.visible,
			stateId: o.imageInspectModal.stateId,
			appSession: o.appSession,
			hide: o.imageInspectModal.hide,
		})),
	);

	const { height, width, resolved } = useImageAutoHeight(
		Data.length > 0 ? Data[0].url : null,
		Dimensions.get('window').width - 8,
		Dimensions.get('window').height - 108,
	);

	useEffect(() => {
		if (!visible) return;

		const obj = appSession.storage.getPostForMediaInspect();
		if (!obj) {
			hide();
			return;
		}
		if (obj.boostedFrom) {
			setPostData(obj.boostedFrom);
			setData(obj.boostedFrom.content.media);
		} else {
			setPostData(obj.boostedFrom);
			setData(obj.content.media);
		}
	}, [stateId]);

	const scale = useSharedValue(1);
	const savedScale = useSharedValue(1);
	const X_OFFSET_MAX = Dimensions.get('window').width / 4;

	const onLeft = useSharedValue(true);
	const xPos = useSharedValue(0);
	const yOffset = useSharedValue(0);
	const xPrev = useSharedValue(0);
	const yPrev = useSharedValue(0);
	const isPinching = useSharedValue(false);

	const PAN_FORCE_X_MULTIPLIER = 0.25;
	const PINCH_FORCE_MULTIPLIER = 0.8;

	const pinchGesture = Gesture.Pinch()
		.onStart((e) => {
			isPinching.value = true;
		})
		.onUpdate((e) => {
			scale.value = savedScale.value * e.scale;
			isPinching.value = true;
		})
		.onEnd(() => {
			if (scale.value > 3) {
				scale.value = withTiming(1, { duration: 100 });
			} else if (scale.value < 1) {
				scale.value = withTiming(1, { duration: 100 });
			} else {
				savedScale.value = scale.value;
			}
			isPinching.value = false;
		});

	const doubleTap = Gesture.Tap()
		.numberOfTaps(2)
		.onEnd(() => {})
		.runOnJS(true);

	const panGesture = Gesture.Pan()
		.enabled(isPinching.value === false)
		.onUpdate((e) => {
			if (isPinching.value === false) {
				xPos.value = xPrev.value + e.translationX * PAN_FORCE_X_MULTIPLIER;
				yOffset.value = e.translationY * PAN_FORCE_X_MULTIPLIER;
			} else {
				xPos.value = xPrev.value;
			}
		})
		.onEnd((e) => {
			if (yOffset.value > 32 || yOffset.value < -32) {
				hide();
			}
			xPos.value = withTiming(0, { duration: 100 });
			yOffset.value = withTiming(0, { duration: 100 });
		})
		.runOnJS(true);

	const animatedStyle = useAnimatedStyle(() => ({
		// @ts-ignore-next-line
		transform: [
			{ scale: scale.value },
			{ translateX: xPos.value },
			{
				translateY: yOffset.value,
			},
		],
	}));

	const composed = Gesture.Simultaneous(panGesture, pinchGesture, doubleTap); //Here

	if (!visible) return <View />;
	return (
		<View style={styles.root}>
			<View style={styles.backdrop} />
			<ImageInspectPostMetrics post={PostData} />
			<GestureDetector gesture={composed}>
				{/*@ts-ignore-next-line*/}
				<Animated.View
					style={[
						styles.box,
						{
							height: Dimensions.get('window').height - 108,
							borderRadius: 8,
						},
						// @ts-ignore-next-line
						animatedStyle,
					]}
				>
					{Data.length > 0 && (
						// @ts-ignore-next-line
						<Image
							source={{
								uri: Data[0].url,
							}}
							style={{
								height: height,
								width: Dimensions.get('window').width - 20,
								borderRadius: 8,
							}}
							contentFit={'contain'}
						/>
					)}
				</Animated.View>
			</GestureDetector>
		</View>
	);
}

export default ImageInspectModal;

const styles = StyleSheet.create({
	root: {
		height: '100%',
		width: '100%',
		position: 'absolute',
		alignItems: 'center',
		// justifyContent: 'flex-start',
		flex: 1,
	},
	imageInspectorPostMetricsContainer: {
		position: 'absolute',
		borderRadius: 12,
		padding: 12,
		zIndex: 99,
		left: '50%',
		bottom: 32,
		transform: [{ translateX: '-50%' }],
		flexDirection: 'row',
	},
	backdrop: {
		height: '100%',
		width: '100%',
		backgroundColor: 'black',
		opacity: 0.84,
		position: 'absolute',
	},
	box: {
		// marginTop: 48,
		position: 'absolute',
		height: '100%',
		// backgroundColor: 'red',
		justifyContent: 'center',
	},
});
