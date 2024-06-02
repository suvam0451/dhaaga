import ApiWrapper from "../components/common/tag/TagBrowseLocal";
import UserProfile from "./shared/profile/UserProfile";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import PostWithClientContext from "./shared/Post";
import WithActivityPubRestClient from "../states/useActivityPubRestClient";
import TimelineRenderer from "./timelines/mastodon/TimelineRenderer";
import WithGorhomBottomSheetContext from "../states/useGorhomBottomSheet";

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
              // component={() => <View style={{backgroundColor: "#121212", height: "100%"}}></View>}
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
