import { View, Text, Dimensions } from "react-native";
import { useEffect, useState } from "react";
import { StandardView } from "../../../styles/Containers";
import { Button, Divider } from "@rneui/base";
import {
	AccountDTO,
	AccountsRepo,
} from "../../../libs/sqlite/repositories/accounts.repo";
import AccountListingFragment from "../fragments/AccountListingFragment";
import MastadonIcon from "../../../assets/svg/Logo_Mastodon_Smaller";

function SelectAccountStack({ navigation }) {
	const [Accounts, setAccounts] = useState<AccountDTO[]>([]);
	useEffect(() => {
		onRefresh();
	}, []);

	function onRefresh() {
		AccountsRepo.get()
			.then((res) => {
				setAccounts(res);
				const accnts: AccountDTO[] = [];
			})
			.catch((e) => {
				console.log(e);
			});
	}

	const MastodonAccounts = Accounts.filter((o) => o.domain === "mastodon");

	return (
		<View style={{ flex: 1, display: "flex" }}>
			<Divider />
			<StandardView style={{ flexGrow: 1 }}>
				<View style={{ marginTop: 16, marginBottom: 16 }}>
					<View
						style={{
							display: "flex",
							flexDirection: "row",
							alignItems: "flex-start",
							marginBottom: 4,
						}}
					>
						<MastadonIcon />
						<Text
							style={{
								fontSize: 20,
								fontWeight: "500",
								marginBottom: 8,
								marginLeft: 8,
							}}
						>
							Mastodon
						</Text>
					</View>

					{MastodonAccounts.map((o) => (
						<AccountListingFragment account={o} />
					))}
				</View>
				<Divider />
				<View style={{ marginTop: 16, marginBottom: 16 }}>
					<Text style={{ fontSize: 20, fontWeight: "500" }}>Misskey</Text>
				</View>
				<Divider />
			</StandardView>
			<StandardView style={{ marginBottom: 32 }}>
				<Button
					onPress={() => {
						navigation.navigate("Select a Platform", { type: "mastodon" });
					}}
				>
					Add an Account
				</Button>
			</StandardView>
		</View>
	);
}

export default SelectAccountStack;
