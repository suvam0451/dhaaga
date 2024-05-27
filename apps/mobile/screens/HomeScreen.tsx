import ApiWrapper from "../components/common/tag/TagBrowseLocal";
import UserProfile from "./shared/profile/UserProfile";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import PostWithClientContext from "./shared/Post";
import WithActivityPubRestClient from "../states/useActivityPubRestClient";
import TimelineRenderer from "./timelines/mastodon/TimelineRenderer";

const Stack = createNativeStackNavigator();

function HomeScreen() {
  return (
      <WithActivityPubRestClient>
        <Stack.Navigator
            initialRouteName={"Mastodon timeline"}
            screenOptions={{headerShown: false}}
        >
          {/*default*/}
          <Stack.Screen
              name="Mastodon timeline"
              component={TimelineRenderer}
          />
          <Stack.Screen
              name="Browse Hashtag"
              component={ApiWrapper}
          />
          <Stack.Screen
              name="Profile"
              component={UserProfile}
          />
          <Stack.Screen
              name="Post"
              component={PostWithClientContext}
          />
        </Stack.Navigator>
      </WithActivityPubRestClient>
  );
}

export default HomeScreen;
