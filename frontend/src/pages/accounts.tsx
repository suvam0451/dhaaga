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
import { useEffect, useState } from "react";
import { GetAccoutsBySubdomain } from "../../wailsjs/go/main/App";
import { threadsdb } from "../../wailsjs/go/models";
import { IconCheck } from "@tabler/icons-react";

function App() {
	const [SelectedProvider, setSelectedProvider] = useState<string | null>(null);
	const [SelectedNetwork, setSelectedNetwork] = useState<string | null>(null);
	const [AccoutList, setAccountList] = useState<threadsdb.ThreadsDb_Account[]>(
		[]
	);
	const [AccountSelected, setAccountSelected] =
		useState<threadsdb.ThreadsDb_Account | null>(null);

	useEffect(() => {
		if (!SelectedProvider || !SelectedNetwork) return;

		GetAccoutsBySubdomain(SelectedProvider, SelectedNetwork).then((res) => {
			console.log("account list", res);
			setAccountList(res);
		});
	}, [SelectedProvider, SelectedNetwork]);

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
		setSelectedProvider(x);
	}

	function onNetworkSelected(x: any) {
		setSelectedNetwork(x);
	}

	return (
		<AppScreenLayout>
			<Flex>
				<Select
					style={{ flex: 1 }}
					mx={"xs"}
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
					mx={"xs"}
					label="Choose Network"
					placeholder="Pick one"
					nothingFound="No results found..."
					data={
						staticDataMapping.find((x) => x.key === SelectedProvider)?.values ||
						[]
					}
					onChange={onNetworkSelected}
					disabled={!SelectedProvider}
					error={
						staticDataMapping?.find((x) => x.key === SelectedProvider)?.values
							?.length! > 0
							? null
							: "No networks currently available for this provider"
					}
				/>
			</Flex>
			<Text style={{ fontWeight: 500 }} py={"md"}>
				Accounts Found Based on your selection
			</Text>
			{AccoutList?.map((o, i) => (
				<Flex key={i} style={{ alignItems: "center" }} my={"xs"}>
					<TextInput disabled={true} value={o.username} />
					<TextInput
						disabled={true}
						value={o.password}
						mx={"xs"}
						type="password"
					/>
					{AccountSelected && AccountSelected.id === o.id ? (
						<IconCheck color="green" size={32} />
					) : (
						<Button
							onClick={() => {
								setAccountSelected(o);
							}}
						>
							Select
						</Button>
					)}
				</Flex>
			))}
			<Flex style={{ alignItems: "center" }}>
				<TextInput placeholder="username" />
				<TextInput placeholder="password" type="password" />
				<Button>Add</Button>
			</Flex>
		</AppScreenLayout>
	);
}

export default App;
