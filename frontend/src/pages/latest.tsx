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
			{providerAuth.selectedAccount?.domain === "mastodon" && (
				<LatestTabRenderer />
			)}
		</AppScreenLayout>
	);
}

export default App;
