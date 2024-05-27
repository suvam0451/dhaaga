import {createNativeStackNavigator} from "@react-navigation/native-stack";
import DirectMessaging
  from "../components/screens/notifications/DirectMessaging";
import MyNotifications
  from "../components/screens/notifications/MyNotifications";
import WithActivityPubRestClient from "../states/useActivityPubRestClient";

const Stack = createNativeStackNavigator();

function WithStackNavigation() {
  return <Stack.Navigator
      initialRouteName={"DirectMessaging"}
      screenOptions={{headerShown: false}}
  >
    <Stack.Screen
        name={"DirectMessaging"}
        component={DirectMessaging}
    />
    <Stack.Screen
        name={"MyNotifications"}
        component={MyNotifications}/>
  </Stack.Navigator>
}


function NotificationsScreen() {
  return <WithActivityPubRestClient>
    <WithStackNavigation/>
  </WithActivityPubRestClient>
}

export default NotificationsScreen;
