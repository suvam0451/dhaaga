import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddAccount from "./stacks/AddMastodonAccount";
import SelectAccountStack from "./stacks/SelectAccount";
import SelectProviderStack from "./stacks/SelectProvider";
import MastodonSignInStack from "./stacks/MastodonSignInStack";

const Stack = createNativeStackNavigator();

function AccountsStack() {
	return (
		// Select an Account
		<Stack.Navigator initialRouteName={"Select an Account"}>
			<Stack.Screen name="Add Mastodon Account" component={AddAccount} />
			<Stack.Screen name="Select a Platform" component={SelectProviderStack} />
			<Stack.Screen name="Select an Account" component={SelectAccountStack} />
			<Stack.Screen
				name="Server Sign-In"
				component={MastodonSignInStack}
				options={{ animation: "none" }}
			/>
		</Stack.Navigator>
	);
}

export default AccountsStack;
