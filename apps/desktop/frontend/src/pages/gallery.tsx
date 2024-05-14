import AppScreenLayout from "../layouts/AppScreenLayout";
import { useSelector } from "react-redux";
import { RootState } from "../lib/redux/store";
import { ProviderAuthState } from "../lib/redux/slices/authSlice";
import LatestTabRenderer from "../components/controllers/LatestTab";
import ModuleAuthProvider from "../contexts/AuthContext";

function App() {
	const providerAuth = useSelector<RootState, ProviderAuthState>(
		(o) => o.providerAuth
	);
	return (
		<AppScreenLayout>
			<ModuleAuthProvider selectedAccount={providerAuth.selectedAccount}>
				{providerAuth.selectedAccount?.domain === "mastodon" && (
					<LatestTabRenderer />
				)}
			</ModuleAuthProvider>
		</AppScreenLayout>
	);
}

export default App;
