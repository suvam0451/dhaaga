import { useEffect, useState } from "react";
import {
	CredentialDTO,
	CredentialsRepo,
} from "../../../libs/sqlite/repositories/credentials.repo";
import { AccountDTO } from "../../../libs/sqlite/repositories/accounts.repo";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { Button, Card } from "@rneui/base";
import { AccountState, accountSlice } from "../../../libs/redux/slices/account";
import { RootState } from "../../../libs/redux/store";
import { useDispatch, useSelector } from "react-redux";

type AccountListingFragmentProps = {
	account: AccountDTO;
};

function AccountListingFragment({ account }: AccountListingFragmentProps) {
	const dispatch = useDispatch();
	const accountState = useSelector<RootState, AccountState>((o) => o.account);

	const [Credentials, setCredentials] = useState<CredentialDTO[]>([]);

	useEffect(() => {
		CredentialsRepo.getByAccountId(account.id).then((res) => {
			setCredentials(res);
		});
	}, [account.id]);

	const avatar = Credentials.find(
		(o) => o.credential_type === "avatar"
	)?.credential_value;

	const displayName = Credentials.find(
		(o) => o.credential_type === "display_name"
	)?.credential_value;

	function onSelectAccount(o: AccountDTO) {
		dispatch(accountSlice.actions.setAccount(o));
		const creds = Credentials.filter((o) => o.account_id === account.id);
		dispatch(accountSlice.actions.setCredentials(creds));
	}

	return (
		<Card
			wrapperStyle={{
				height: 48,
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
			}}
			containerStyle={{
				margin: 0,
				padding: 8,
				backgroundColor:
					accountState.activeAccount?.id === account.id ? "#E5FFDA" : "white",
			}}
		>
			<View>
				{avatar && (
					<View style={{ height: 48, width: 48 }}>
						<Image
							style={styles.image}
							source={avatar}
							contentFit="fill"
							transition={1000}
						/>
					</View>
				)}
			</View>
			<View style={{ marginLeft: 8, flexGrow: 1 }}>
				{displayName && (
					<Text style={{ fontWeight: "500" }}>{displayName}</Text>
				)}
				<Text style={{ color: "gray", fontSize: 14 }}>{account.username}</Text>
			</View>
			<View
				style={{
					display: "flex",
					justifyContent: "flex-end",
					flexDirection: "row",
					marginRight: 8,
					alignItems: "center",
				}}
			>
				{accountState.activeAccount?.id !== account.id && (
					<TouchableOpacity
						onPress={() => {
							onSelectAccount(account);
						}}
					>
						<Button type="clear">Select</Button>
					</TouchableOpacity>
				)}

				<Ionicons name="menu-outline" size={32} color="black" />
			</View>
		</Card>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	image: {
		flex: 1,
		width: "100%",
		backgroundColor: "#0553",
	},
});

export default AccountListingFragment;
