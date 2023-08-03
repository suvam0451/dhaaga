import { useRef } from "react";
import {
	View,
	Text,
	FlatList,
	ScrollView,
	SafeAreaView,
	Animated,
} from "react-native";
import styled from "styled-components/native";

const DummyListItem = styled.View`
	background-color: #ccc;
	margin: 2rem 2rem;
	height: 500px;
`;

const HeaderComponent = styled.View`
	background-color: black;
	color: #fff;
	height: 56px;
`;

type HomeScreenProps = {
	ScrollY: number;
	setScrollYValue: (value: number) => void;
};

function HomeScreen({ ScrollY, setScrollYValue }: HomeScreenProps) {
	const data = [
		{
			title: "One",
		},
		{
			title: "Two",
		},
		{
			title: "Three",
		},
	];

	let AnimatedHeaderHeightValue = new Animated.Value(0);
	const HEADER_MAX_HEIGHT = 150;
	const HEADER_MIN_HEIGHT = 50;

	const animatedHeaderHeight = AnimatedHeaderHeightValue.interpolate({
		inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
		outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
		extrapolate: "clamp",
	});

	return (
		<FlatList
			data={data}
			renderItem={(o) => (
				<DummyListItem>
					<Text>{o.item.title}</Text>
				</DummyListItem>
			)}
		/>
	);
}

export default HomeScreen;
