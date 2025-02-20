import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import { Alert, Dimensions, Pressable, StyleSheet, View } from 'react-native';
import useGlobalState from '../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { useEffect, useState } from 'react';
import type { PostMediaAttachmentType, PostObjectType } from '@dhaaga/core';
import { Image } from 'expo-image';
import { AppIcon } from '../lib/Icon';
import { useImageAutoHeight } from '../../hooks/app/useImageDims';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../utils/theming.util';
import { useAppTheme } from '../../hooks/utility/global-state-extractors';
import { AppText } from '../lib/Text';
import { APP_FONTS } from '../../styles/AppFonts';
import { LinkingUtils } from '../../utils/linking.utils';
import { AppDownloadService } from '../../services/app.service';
import { RandomUtil } from '@dhaaga/core';

type StatSectionProps = {
	icon: any;
	count: number;
	last?: boolean;
	label: string;
	onPress: () => void;
};

function StatSection({ icon, count, last, label, onPress }: StatSectionProps) {
	if (count === 0 && !label)
		return (
			<View style={{ paddingHorizontal: 4, paddingRight: last ? 0 : 16 }}>
				{icon}
			</View>
		);

	return (
		<Pressable
			style={{ paddingHorizontal: 4, flexDirection: 'row' }}
			onPress={onPress}
		>
			<AppText.Medium
				style={{ fontFamily: APP_FONTS.INTER_500_MEDIUM, marginRight: 6 }}
				emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
			>
				{label}
			</AppText.Medium>
			{icon}
		</Pressable>
	);
}

type ImageInspectPostMetricsProps = {
	post: PostObjectType;
	imageUrl: string;
};

function ImageInspectPostMetrics({
	post,
	imageUrl,
}: ImageInspectPostMetricsProps) {
	const { theme } = useAppTheme();
	const { hide } = useGlobalState(
		useShallow((o) => ({
			hide: o.imageInspectModal.hide,
		})),
	);
	return (
		<View
			style={[
				styles.imageInspectorPostMetricsContainer,
				{
					backgroundColor: theme.background.a20,
				},
			]}
		>
			<View style={{ flexDirection: 'row' }}>
				<Pressable
					style={{ paddingHorizontal: 0, paddingRight: 8 }}
					onPress={() => {
						hide();
					}}
				>
					<AppIcon
						id={'close'}
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
						onPress={() => {
							hide();
						}}
					/>
				</Pressable>
				<View
					style={{
						height: '100%',
						width: 2,
						backgroundColor: '#363636',
						marginHorizontal: 8,
						marginLeft: 0,
					}}
				/>
				<StatSection
					icon={
						<AppIcon
							id={'share'}
							size={22}
							emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
						/>
					}
					count={0}
					last
					label={'Share'}
					onPress={() => {
						LinkingUtils.shareImageWithFriends(imageUrl);
					}}
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
					label={'Save'}
					onPress={async () => {
						try {
							const result = await AppDownloadService.saveToAppDirectory(
								imageUrl,
								`${RandomUtil.nanoId()}_1.png`,
							);
							if (result.success) {
								Alert.alert('Download Succeeded!');
							} else {
								Alert.alert('Download Failed!');
							}
						} catch (e) {
							console.log(e);
							Alert.alert('Download Failed!');
						}
					}}
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
	const [Data, setData] = useState<PostMediaAttachmentType[]>([]);
	const [PostData, setPostData] = useState(null);
	const { visible, stateId, appSession, hide } = useGlobalState(
		useShallow((o) => ({
			visible: o.imageInspectModal.visible,
			stateId: o.imageInspectModal.stateId,
			appSession: o.appSession,
			hide: o.imageInspectModal.hide,
		})),
	);

	const imgUrl = Data.length > 0 ? Data[0].url : null;
	const { height, width, resolved } = useImageAutoHeight(
		imgUrl,
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
			<ImageInspectPostMetrics post={PostData} imageUrl={imgUrl} />
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
