import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MastodonTimeline from "./mastodon/TimelineRenderer";

import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import HashtagBrowse from "../shared/hashtags/HashtagBrowse";

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
			<Stack.Screen
				name="Browse Hashtag"
				component={HashtagBrowse}
				options={({ route }: any) => ({
					title: route?.params?.title || "Hashtag",
				})}
			/>
		</Stack.Navigator>
	);
}

export default HomeStack;
