import { StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { APP_FONT } from '../../../../styles/AppTheme';
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from 'react-native-reanimated';
import { Fragment, useState } from 'react';
import FloatingActionButtonOption from '../../../lib/FloatingActionButtonOption';

const Y_OFFSET_MENU_ITEM = 72;

function AddServerWidget({ onPress }: { onPress: () => void }) {
	const rotation = useSharedValue(0);
	const displacementY = useSharedValue(0);

	const [IsExpanded, setIsExpanded] = useState(false);

	const rotateElement = () => {
		rotation.value = withTiming(
			rotation.value + 360,
			{ duration: 200, easing: Easing.linear },
			() => {
				rotation.value = 0; // Reset rotation value after completing 360 degrees
			},
		);

		if (IsExpanded) {
			displacementY.value = withTiming(0, { duration: 360 });
		} else {
			displacementY.value = withSpring(-Y_OFFSET_MENU_ITEM);
		}

		setIsExpanded((IsExpanded) => !IsExpanded);
	};
	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ rotate: `${rotation.value}deg` }],
		};
	});

	const menuItemAAnimated = useAnimatedStyle(() => {
		return {
			transform: [{ translateY: displacementY.value }],
		};
	});

	function onPressImpl() {
		rotateElement();
	}

	return (
		<Fragment>
			<TouchableOpacity
				style={[styles.widgetContainerCollapsed, { zIndex: 30 }]}
				onPress={onPressImpl}
			>
				<Animated.View
					style={{
						display: 'flex',
						flexDirection: 'row',
						width: '100%',
						justifyContent: 'center',
						padding: 12,
						paddingVertical: 16,
					}}
				>
					<Animated.View style={[{ width: 24 }, animatedStyle]}>
						<FontAwesome5
							name="filter"
							size={24}
							color={APP_FONT.MONTSERRAT_BODY}
						/>
					</Animated.View>
				</Animated.View>
			</TouchableOpacity>
			<FloatingActionButtonOption
				isExpanded={IsExpanded}
				index={0}
				label={'Navigate'}
				onPress={() => {
					console.log('ok');
				}}
				icon={'navigate'}
			/>
			<FloatingActionButtonOption
				isExpanded={IsExpanded}
				index={1}
				label={'Add a Server'}
				onPress={() => {
					console.log('ok');
				}}
				icon={'add'}
			/>
			<FloatingActionButtonOption
				isExpanded={IsExpanded}
				index={2}
				label={'Sync Status'}
				onPress={() => {
					console.log('ok');
				}}
				icon={'filter'}
			/>
		</Fragment>
	);
}

export default AddServerWidget;

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
