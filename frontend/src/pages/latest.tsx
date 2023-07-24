import { Text } from "@mantine/core";
import AppScreenLayout from "../layouts/AppScreenLayout";
import { useSelector } from "react-redux";
import { RootState } from "../lib/redux/store";
import { ProviderAuthState } from "../lib/redux/slices/authSlice";
import LatestTabRenderer from "../components/controllers/LatestTab";

function App() {
	const providerAuth = useSelector<RootState, ProviderAuthState>(
		(o) => o.providerAuth
	);

	return (
		<AppScreenLayout>
			<Text size={32}>Discover</Text>
			{providerAuth.selectedAccount?.domain === "mastodon" && (
				<LatestTabRenderer />
			)}
		</AppScreenLayout>
	);
}

export default App;
