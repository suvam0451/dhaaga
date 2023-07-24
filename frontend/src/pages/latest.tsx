import { Tabs, Text, TextInput } from "@mantine/core";
import AppScreenLayout from "../layouts/AppScreenLayout";
import { useSelector } from "react-redux";
import { RootState } from "../lib/redux/store";
import { ProviderAuthState } from "../lib/redux/slices/authSlice";
import { useEffect } from "react";
import MastadonDiscover from "../components/discover/Mastadon";

function App() {
	const providerAuth = useSelector<RootState, ProviderAuthState>(
		(o) => o.providerAuth
	);

	useEffect(() => {
		console.log(providerAuth);
	}, [providerAuth.selectedAccount]);

	return (
		<AppScreenLayout>
			<Text size={32}>Discover</Text>
			{providerAuth.selectedAccount?.domain === "mastadon" && (
				<MastadonDiscover />
			)}
		</AppScreenLayout>
	);
}

export default App;
