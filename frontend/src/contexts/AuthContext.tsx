import { createContext, useContext, useEffect, useState } from "react";
import { ProviderAuthItem } from "../lib/redux/slices/authSlice";
import { KeystoreService } from "../services/keystore.services";
import { GetCredentialsByAccountId } from "../../wailsjs/go/main/App";

type AuthReturnStatus =
	| {
			provider: "mastodon";
			creds: {
				profilePicUrl?: string;
				displayName?: string;
				instanceUrl: string;
				accessToken: string;
			};
	  }
	| {
			provider: "instagram";
			creds: {
				accessToken: string;
				profilePicUrl?: string;
			};
	  }
	| null
	| undefined;

type StoreType = {
	// selection
	selectedAccount: ProviderAuthItem | null;
};

type DispatchType = {
	verifyAuthStatus: () => Promise<AuthReturnStatus>;
};

const storeDefault = {
	selectedAccount: null,
};

const dispatchDefault = {
	verifyAuthStatus: async () => undefined,
};

const StoreContext = createContext<StoreType>(storeDefault);
const DispatchContext = createContext<DispatchType>(dispatchDefault);

/**
 * Ensures that a module (group of related columns)
 * always have the auth credentials available
 * @param param0
 * @returns
 */
function ModuleAuthProvider({
	children,
	selectedAccount,
}: {
	selectedAccount: ProviderAuthItem | null;
	children: any;
}) {
	const [providerAuth, setProviderAuth] = useState<StoreType>(storeDefault);

	useEffect(() => {
		setProviderAuth({
			selectedAccount,
		});
	}, [selectedAccount]);

	async function verifyAuthStatus(): Promise<AuthReturnStatus> {
		const domain = providerAuth.selectedAccount?.domain;
		const subdomain = providerAuth.selectedAccount?.subdomain;

		if (!domain || !subdomain || !selectedAccount) {
			return null;
		}

		const creds = await GetCredentialsByAccountId(
			providerAuth.selectedAccount!.id
		);
		if (!creds) {
			return null;
		}
		if (domain === "mastodon") {
			const { success, data } = KeystoreService.verifyMastadonCredentials(
				subdomain,
				creds
			);
			if (!success) {
				return null;
			}
			return {
				provider: "mastodon",
				creds: data!,
			};
		}
		return null;
	}

	return (
		<StoreContext.Provider value={providerAuth}>
			<DispatchContext.Provider value={{ verifyAuthStatus }}>
				{children}
			</DispatchContext.Provider>
		</StoreContext.Provider>
	);
}

export function ModuleAuthHook() {
	return {
		store: useContext(StoreContext),
		dispatch: useContext(DispatchContext),
	};
}

export default ModuleAuthProvider;
