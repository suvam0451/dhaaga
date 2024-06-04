import {TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import MastodonServerSelect from "./accounts/stacks/Mastodon/ServerSelection";
import MisskeyServerSelect from "./accounts/stacks/Misskey/ServerSelection";
import SelectProvider
  from "../components/screens/accounts/stack/SelectProvider";
import SelectAccountStack from "./accounts/stacks/SelectAccount";
import MastodonSignIn from "./accounts/stacks/Mastodon/SignIn";
import MisskeySignIn from "./accounts/stacks/Misskey/SignIn";
import {createNativeStackNavigator} from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

function WithNavigation() {
  return (
      <Stack.Navigator
          initialRouteName={"Select an Account"}
          screenOptions={{headerShown: false}}>
        <Stack.Screen
            name="Select an Account"
            component={SelectAccountStack}
            options={{
              headerTintColor: "black",
              headerRight: () => (
                  <TouchableOpacity onPress={() => {
                    console.log("refreshing account list...")
                  }}>
                    <Ionicons name="refresh" size={28} color="black"/>
                  </TouchableOpacity>
              ),
            }}
        />

        <Stack.Screen
            name="Select Mastodon Server"
            component={MastodonServerSelect}
        />
        <Stack.Screen
            name="Select Misskey Server"
            component={MisskeyServerSelect}
        />
        {/*Signup Phase 1*/}
        <Stack.Screen name="Select a Platform" component={SelectProvider}/>

        {/*Signup Phase 2*/}
        <Stack.Screen
            name="Mastodon Sign-In"
            component={MastodonSignIn}
            options={{animation: "none"}}
        />
        <Stack.Screen
            name="Misskey Sign-In"
            component={MisskeySignIn}
            options={{animation: "none"}}
        />
      </Stack.Navigator>
  );
}

function AccountsScreen() {
  return <WithNavigation/>
}

export default AccountsScreen;
