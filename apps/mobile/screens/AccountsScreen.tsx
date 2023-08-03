import { View, Text } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { StandardView } from "../styles/Containers";

function AccountsScreen() {
	return (
		<View style={{ flex: 1 }}>
			<StandardView
				style={{
					display: "flex",
					marginTop: 40,
					marginBottom: 20,
					justifyContent: "space-between",
					flexDirection: "row",
				}}
			>
				<Text style={{ fontSize: 24 }}>Add an Account</Text>
				<Ionicons name={"refresh-outline"} size={24} />
			</StandardView>

			{/* {Step > 0 && <SignInWebview uri={AuthUri} setCode={setCode} />} */}
			{/* {Step > 0 && <PasteTokenStep Subdomain={Subdomain} Code={Code} />} */}
		</View>
	);
}

export default AccountsScreen;
