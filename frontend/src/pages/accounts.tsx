import {
	Box,
	Button,
	Flex,
	List,
	Select,
	Text,
	TextInput,
} from "@mantine/core";
import AppScreenLayout from "../layouts/AppScreenLayout";
import { useEffect } from "react";
import { GetAccoutsBySubdomain } from "../../wailsjs/go/main/App";
import { IconCheck } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../lib/redux/store";
import {
	ProviderAuthState,
	providerAuthSlice,
} from "../lib/redux/slices/authSlice";
import MetaThreadsAddAccount from "../components/auth/MetaThreadsAddAccount";
import AddAccountMastadon from "../components/auth/AddAccountMastadon";

function App() {
	const dispatch = useDispatch<AppDispatch>();
	const providerAuth = useSelector<RootState, ProviderAuthState>(
		(o) => o.providerAuth
	);

	useEffect(() => {
		if (!providerAuth.selectedDomain || !providerAuth.selectedSubDomain) return;

		GetAccoutsBySubdomain(
			providerAuth.selectedDomain,
			providerAuth.selectedSubDomain
		).then((res) => {
			console.log("setting accounts", res);
			dispatch(providerAuthSlice.actions.setAccounts(res));
		});
	}, [providerAuth.selectedDomain, providerAuth.selectedSubDomain]);

	const staticDataMapping = [
		{
			key: "meta",
			values: ["instagram", "threads"],
		},
		{
			key: "mastodon",
			values: [],
		},
	];

	function onProviderSelected(x: any) {
		dispatch(providerAuthSlice.actions.setSelectedDomain(x));
	}

	function onNetworkSelected(x: any) {
		dispatch(providerAuthSlice.actions.setSelectedSubdomain(x));
	}

	return (
		<AppScreenLayout>
			<Flex w={"100%"}>
				<Select
					style={{ flex: 1 }}
					mr={"xs"}
					label="Choose Provider"
					placeholder="Pick one"
					nothingFound="No results found..."
					data={[
						{ value: "meta", label: "Meta" },
						{ value: "mastodon", label: "Mastodon" },
					]}
					onChange={onProviderSelected}
				/>

				<Select
					style={{ flex: 1 }}
					ml={"xs"}
					label="Choose Network"
					placeholder="Pick one"
					nothingFound="No results found..."
					data={
						staticDataMapping.find((x) => x.key === providerAuth.selectedDomain)
							?.values || []
					}
					onChange={onNetworkSelected}
					disabled={providerAuth.selectedDomain === ""}
					error={
						staticDataMapping?.find(
							(x) => x.key === providerAuth.selectedDomain
						)?.values?.length! > 0
							? null
							: "No networks currently available for this provider"
					}
				/>
			</Flex>
			<Text style={{ fontWeight: 500 }} pt={"lg"} pb={"xs"}>
				Accounts Found for This Network
			</Text>
			{providerAuth?.accounts.map((o, i) => (
				<Flex key={i} style={{ alignItems: "center" }} my={"xs"}>
					<TextInput disabled={true} value={o.username} />
					<TextInput
						disabled={true}
						value={o.password}
						mx={"xs"}
						type="password"
					/>
					{providerAuth.selectedAccount &&
					providerAuth.selectedAccount.id === o.id ? (
						<IconCheck color="green" size={32} />
					) : (
						<Button
							onClick={() => {
								dispatch(providerAuthSlice.actions.setSelectedAccount(o));
							}}
						>
							Select
						</Button>
					)}
				</Flex>
			))}
			<MetaThreadsAddAccount />
			<AddAccountMastadon />
		</AppScreenLayout>
	);
}

export default App;
