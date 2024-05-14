import { createContext, useContext, useState } from "react";

type StoreType = {
	domain: string;
	subdomain: string;
	username: string;
	password: string;
	passwordRequired: boolean;
	credentials: Record<string, string>;
	account?: any;
	loading: boolean;
};

type DispatchType = {
	setsubDomain: (domain: string) => void;
	setUsername: (username: string) => void;
	setPassword: (password: string) => void;
	setCredentials: ({ key, value }: { key: string; value: string }) => void;
	setLoading: (loading: boolean) => void;
};

const storeDefault = {
	domain: "",
	subdomain: "",
	username: "",
	password: "",
	passwordRequired: false,
	credentials: {},
	loading: false,
};

const dispatchDefault = {
	setsubDomain: () => {},
	setUsername: () => {},
	setPassword: () => {},
	setCredentials: () => {},
	setLoading: () => {},
};

const StoreContext = createContext<StoreType>(storeDefault);
const DispatchContext = createContext<DispatchType>(dispatchDefault);

function OnboardingProvider({
	children,
}: {
	children: any;
}) {
	const [Username, setUsername] = useState("");
	const [Password, setPassword] = useState("");
	const [Subdomain, setSubdomain] = useState("");
	const [Credentials, setCredentials] = useState<Record<string, string>>({});
	const [Loading, setLoading] = useState(false);

	function _setLoading(x: boolean) {
		setLoading(x);
	}

	function _setSubdomain(x: string) {
		setSubdomain(x);
	}

	function _setUsername(x: string) {
		setUsername(x);
	}

	function _setPassword(x: string) {
		setPassword(x);
	}

	function _setCredentials({ key, value }: { key: string; value: string }) {
		setCredentials({ ...Credentials, [key]: value });
	}
	return (
		<StoreContext.Provider
			value={{
				username: Username,
				password: Password,
				credentials: Credentials,
				subdomain: Subdomain,
				domain: "",
				passwordRequired: false,
				loading: Loading,
			}}
		>
			<DispatchContext.Provider
				value={{
					setsubDomain: _setSubdomain,
					setUsername: _setUsername,
					setPassword: _setPassword,
					setCredentials: _setCredentials,
					setLoading: _setLoading,
				}}
			>
				{children}
			</DispatchContext.Provider>
		</StoreContext.Provider>
	);
}

export function useOnboardingProviderHook() {
	return {
		store: useContext(StoreContext),
		dispatch: useContext(DispatchContext),
	};
}

export default OnboardingProvider;
