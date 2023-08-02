import { View, Text } from "react-native";
import SignInWebview from "./accounts/SignInPage";
import SelectServer from "./accounts/SelectServer";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { StandardView } from "../styles/Containers";
import PasteTokenStep from "./accounts/PasteTokenStep";

function AccountsScreen() {
	const [Step, setStep] = useState(0);
	const [AuthUri, setAuthUri] = useState("");

	function reset() {
		setStep(0);
	}
	function nextStep() {
		setStep(Step + 1);
	}
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
				<Ionicons name={"refresh-outline"} onPress={reset} size={24} />
			</StandardView>

			<SelectServer Step={Step} nextStep={nextStep} setAuthUri={setAuthUri} />
			{Step > 0 && <SignInWebview uri={AuthUri} />}
			{Step > 0 && <PasteTokenStep />}
		</View>
	);
}

export default AccountsScreen;
