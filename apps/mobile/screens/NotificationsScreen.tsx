import {createNativeStackNavigator} from "@react-navigation/native-stack";
import DirectMessaging
  from "../components/screens/notifications/DirectMessaging";
import MyNotifications
  from "../components/screens/notifications/MyNotifications";
import WithActivityPubRestClient from "../states/useActivityPubRestClient";
import DirectMessagingRoom
  from "../components/screens/notifications/DirectMessagingRoom";
import WithGorhomBottomSheetContext from "../states/useGorhomBottomSheet";

const Stack = createNativeStackNavigator();

function WithStackNavigation() {
  return <WithGorhomBottomSheetContext>
    <Stack.Navigator
        initialRouteName={"DirectMessaging"}
        screenOptions={{headerShown: false}}
    >
      <Stack.Screen
          name={"DirectMessaging"}
          component={DirectMessaging}
      />
      <Stack.Screen
          name={"DirectMessagingRoom"}
          component={DirectMessagingRoom}
      />
      <Stack.Screen
          name={"MyNotifications"}
          component={MyNotifications}/>
    </Stack.Navigator>
  </WithGorhomBottomSheetContext>
}

function NotificationsScreen() {
  return <WithStackNavigation/>
}

export default NotificationsScreen;
