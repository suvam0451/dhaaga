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


	return (
		<View></View>
	);
}

export default HomeScreen;
