import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MastodonTimeline from "./mastodon/TimelineRenderer";

import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Stack = createNativeStackNavigator();

function HomeStack() {
	return (
		// Select an Account
		<Stack.Navigator initialRouteName={"Mastodon timeline"}>
			<Stack.Screen
				name="Mastodon timeline"
				options={{ headerShown: false }}
				component={MastodonTimeline}
			/>
		</Stack.Navigator>
	);
}

export default HomeStack;
