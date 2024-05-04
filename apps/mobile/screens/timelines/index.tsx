import {createNativeStackNavigator} from "@react-navigation/native-stack";
import MastodonTimeline from "./mastodon/TimelineRenderer";

import {TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import HashtagBrowse from "../shared/hashtags/HashtagBrowse";
import UserProfile from "../shared/profile/UserProfile";

const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
      // Select an Account
      <Stack.Navigator initialRouteName={"Mastodon timeline"}
                       screenOptions={{headerShown: false}}
      >
        <Stack.Screen
            name="Mastodon timeline"
            options={{headerShown: false}}
            component={MastodonTimeline}
        />
        <Stack.Screen
            name="Browse Hashtag"
            component={HashtagBrowse}
            options={({route}: any) => ({
              title: route?.params?.title || "Hashtag",
            })}
        />
        <Stack.Screen
            name="Profile"
            component={UserProfile}
            options={({route}: any) => ({
              // id: route?.params?.id || "Profile",
            })}
        />
      </Stack.Navigator>
  );
}

export default HomeStack;
