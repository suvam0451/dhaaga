import { useState } from 'react';
import { View, Text } from 'react-native';
import { Button } from '@rneui/base';
import { ScrollView } from 'react-native';
import Animated, {
	Extrapolation,
	interpolate,
	runOnJS,
	useAnimatedScrollHandler,
	useSharedValue,
	withDelay,
	withSpring,
	withTiming,
} from 'react-native-reanimated';
import { Link } from 'expo-router';

function SettingsScreen() {
	const [EmojiCount, setEmojiCount] = useState(0);
	const [Emojis, setEmojis] = useState([]);

	async function onClick() {}

	//
	// const contentOffsetY = useSharedValue(0);
	// const translateYY = useSharedValue(0);
	// const PivotY = useSharedValue(0);
	// const showHeader = useSharedValue(true);
	//
	// const onScroll = useAnimatedScrollHandler(
	// 	{
	// 		onScroll: (e) => {
	// 			contentOffsetY.value = e.contentOffset.y;
	// 			if (contentOffsetY.value - PivotY.value > 20) {
	// 				showHeader.value = false;
	// 			} else if (PivotY.value - contentOffsetY.value > 40) {
	// 				showHeader.value = true;
	// 			}
	// 			if (!showHeader.value) {
	// 				translateYY.value = withSpring(-50);
	// 			} else {
	// 				translateYY.value = withDelay(50, withTiming(0));
	// 			}
	//
	// 			runOnJS(onScrollJs)(e);
	// 		},
	// 		onBeginDrag: (e) => {
	// 			PivotY.value = e.contentOffset.y;
	// 		},
	// 	},
	// 	[],
	// );

	// function ButtonClicked() {
	// 	console.log(contentOffsetY.value, translateYY.value, PivotY.value);
	// }

	return (
		<View
			style={{
				flex: 1,
				// justifyContent: 'center',
				// alignItems: 'center',
				position: 'relative',
				// height: 500,
			}}
		>
			<Animated.View
				style={[
					{
						position: 'absolute',
						height: 50,
						width: '100%',
						backgroundColor: 'blue',
						zIndex: 99,
					},
					// { transform: [{ translateY: translateYY }] },
				]}
			></Animated.View>
			<View
				style={{
					position: 'absolute',
					bottom: '50%',
					left: 32,
					marginTop: 10,
					zIndex: 99,
				}}
			>
				<Link href={'/settings/server-debugger'}>Server Debugger</Link>
				{/*<Button onPress={() => {}}>Click Me</Button>*/}
			</View>

			<Animated.ScrollView
				// onScroll={onScroll}
				contentContainerStyle={{
					width: 400,
					backgroundColor: 'red',
				}}
			>
				<Text>Settings!</Text>
				<Text>{EmojiCount}</Text>
				<View style={{ height: 2000 }}></View>

				{Emojis.map((o, i) => (
					<Text style={{ color: 'black' }} key={i}>
						{o.name}
					</Text>
				))}
			</Animated.ScrollView>
			{/*<Button onPress={onClick}>Click Me!</Button>*/}
		</View>
	);
}

export default SettingsScreen;
