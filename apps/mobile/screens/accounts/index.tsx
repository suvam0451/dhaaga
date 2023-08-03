import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddAccount from "./stacks/AddMastodonAccount";
import SelectAccountStack from "./stacks/SelectAccount";
import SelectProviderStack from "./stacks/SelectProvider";
import MastodonSignInStack from "./stacks/MastodonSignInStack";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Stack = createNativeStackNavigator();

function AccountsStack() {
	return (
		// Select an Account
		<Stack.Navigator initialRouteName={"Select an Account"}>
			<Stack.Screen name="Add Mastodon Account" component={AddAccount} />
			<Stack.Screen name="Select a Platform" component={SelectProviderStack} />
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
				name="Server Sign-In"
				component={MastodonSignInStack}
				options={{ animation: "none" }}
			/>
		</Stack.Navigator>
	);
}

export default AccountsStack;
