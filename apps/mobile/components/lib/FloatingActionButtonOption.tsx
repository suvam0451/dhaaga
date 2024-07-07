import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withSpring,
	withTiming,
} from 'react-native-reanimated';
import { memo, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { APP_FONT } from '../../styles/AppTheme';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';

const Y_OFFSET_MENU_ITEM = 72;
const ICON_SIZE = 24;

type SUPPORTED_ICONS = 'add' | 'filter' | 'navigate';
type Props = {
	isExpanded: boolean;
	index: number;
	label: string;
	onPress: () => void;
	icon: SUPPORTED_ICONS;
};

const DisplayIcon = memo(function Foo({ icon }: { icon: SUPPORTED_ICONS }) {
	const Icon = useMemo(() => {
		switch (icon) {
			case 'add':
				return (
					<FontAwesome6
						name="plus"
						size={ICON_SIZE}
						color={APP_FONT.MONTSERRAT_BODY}
					/>
				);
			case 'filter':
				return (
					<FontAwesome5
						name="filter"
						size={ICON_SIZE}
						color={APP_FONT.MONTSERRAT_BODY}
					/>
				);
			case 'navigate':
				return (
					<Ionicons
						name="navigate"
						size={ICON_SIZE}
						color={APP_FONT.MONTSERRAT_BODY}
					/>
				);
		}
	}, [icon]);

	return (
		<View style={styles.widgetContainerCollapsedCButton}>
			<View
				style={[
					{
						display: 'flex',
						flexDirection: 'row',
						width: '100%',
						justifyContent: 'center',
						padding: 12,
						paddingVertical: 16,
					},
				]}
			>
				<View style={[{ width: 24 }]}>{Icon}</View>
			</View>
		</View>
	);
});

function FloatingActionButtonOption({
	isExpanded,
	index,
	label,
	onPress,
	icon,
}: Props) {
	const displacementY = useSharedValue(0);

	const yOffset = useRef(-(index + 1) * Y_OFFSET_MENU_ITEM);

	const textRotation = useSharedValue(0);
	const textOpacity = useSharedValue(0);

	useEffect(() => {
		if (isExpanded) {
			displacementY.value = withSpring(yOffset.current);
			textRotation.value = withDelay(200, withSpring(0));
			textOpacity.value = withDelay(200, withSpring(1));
		} else {
			displacementY.value = withTiming(0, { duration: 360 });
			textRotation.value = withSpring(-15);
			textOpacity.value = withSpring(0);
		}
	}, [isExpanded]);

	const position = useAnimatedStyle(() => {
		return {
			transform: [{ translateY: displacementY.value }],
		};
	});

	// @ts-ignore
	const textAnim = useAnimatedStyle(() => {
		return {
			transform: [
				{ translateX: 50 },
				{ translateY: 50 },
				{ rotateZ: `${textRotation.value}deg` },
				{ translateX: -50 },
				{ translateY: -50 },
			],
			opacity: textOpacity.value,
		};
	});

	function onPressImpl() {
		onPress();
	}

	return (
		<Animated.View
			style={[styles.widgetContainerCollapsedCore, position]}
			onTouchEnd={onPressImpl}
		>
			<DisplayIcon icon={icon} />
			<Animated.View
				style={[
					{
						marginRight: 8,
						backgroundColor: 'rgba(54,54,54,0.87)',
						padding: 8,
						borderRadius: 8,
					},
					textAnim,
				]}
			>
				<Animated.Text
					style={{
						fontFamily: 'Montserrat-Bold',
						color: APP_FONT.MONTSERRAT_BODY,
					}}
				>
					{label}
				</Animated.Text>
			</Animated.View>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	widgetContainerCollapsed: {
		marginBottom: 16,
		backgroundColor: 'rgba(54,54,54,0.85)',
		display: 'flex',
		position: 'absolute',
		bottom: 0,
		right: 0,
		borderRadius: 16,
		maxWidth: 64,
		marginRight: 16,
	},
	widgetContainerCollapsedCore: {
		marginBottom: 16,
		display: 'flex',
		position: 'absolute',
		bottom: 0,
		right: 0,
		flexDirection: 'row-reverse',
		alignItems: 'center',
	},
	widgetContainerCollapsedCButton: {
		backgroundColor: 'rgba(54,54,54,0.85)',
		borderRadius: 16,
		maxWidth: 64,
		marginRight: 16,
	},
});

export default FloatingActionButtonOption;
