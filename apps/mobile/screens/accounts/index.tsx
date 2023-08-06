import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SelectAccountStack from "./stacks/SelectAccount";
import SelectProvider from "./stacks/SelectProvider";
import MastodonServerSelect from "./stacks/Mastodon/ServerSelection";
import MastodonSignIn from "./stacks/Mastodon/SignIn";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MisskeyServerSelect from "./stacks/Misskey/ServerSelection";
import MisskeySignIn from "./stacks/Misskey/SignIn";

const Stack = createNativeStackNavigator();

function AccountsStack() {
	return (
		// Select an Account
		<Stack.Navigator initialRouteName={"Select an Account"}>
			<Stack.Screen
				name="Select Mastodon Server"
				component={MastodonServerSelect}
			/>
			<Stack.Screen
				name="Select Misskey Server"
				component={MisskeyServerSelect}
			/>
			<Stack.Screen name="Select a Platform" component={SelectProvider} />
			<Stack.Screen
				name="Select an Account"
				component={SelectAccountStack}
				options={{
					headerStyle: {
						// backgroundColor: "orange",
					},
					headerTintColor: "black",
					headerRight: () => (
						<TouchableOpacity onPress={() => {}}>
							<Ionicons name="refresh" size={28} color="black" />
						</TouchableOpacity>
					),
				}}
			/>
			<Stack.Screen
				name="Mastodon Sign-In"
				component={MastodonSignIn}
				options={{ animation: "none" }}
			/>
			<Stack.Screen
				name="Misskey Sign-In"
				component={MisskeySignIn}
				options={{ animation: "none" }}
			/>
		</Stack.Navigator>
	);
}

export default AccountsStack;
