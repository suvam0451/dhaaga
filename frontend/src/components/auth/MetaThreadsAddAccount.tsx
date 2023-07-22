import { Button, Flex, TextInput, Text } from "@mantine/core";
import { ReactElement, useState } from "react";
import { KeystoreService } from "../../services/keystore.services";
import { IconCheck, IconX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

function MetaThreadsAddAccount() {
	const [Username, setUsername] = useState<string>("");
	const [Password, setPassword] = useState<string>("");
	const [IsLoading, setIsLoading] = useState<boolean>(false);

	async function onClickAddAccount() {
		setIsLoading(true);

		notifications.show({
			id: "attempting-auth",
			loading: true,
			title: "Trying to Login",
			message: "You will ne notified of the result soon",
			autoClose: false,
			withCloseButton: false,
		});

		const res = await KeystoreService.verifyInstagramAccount(
			Username,
			Password
		);

		if (res === "") {
			notifications.update({
				id: "attempting-auth",
				color: "teal",
				title: "Account Successfully Added",
				message: `You can use ${Username} to log into Meta Threads`,
				icon: <IconCheck />,
				autoClose: 3000,
			});
		} else {
			notifications.update({
				id: "attempting-auth",
				color: "red",
				title: "Could not log in",
				message: `[ERROR]: ${res}`,
				icon: <IconX />,
				autoClose: 10000,
			});
		}
		setIsLoading(false);
	}

	return (
		<Flex style={{ alignItems: "center" }}>
			<TextInput
				placeholder="username"
				onChange={(e) => {
					setUsername(e.currentTarget.value);
				}}
			/>
			<TextInput
				placeholder="password"
				onChange={(e) => {
					setPassword(e.currentTarget.value);
				}}
				type="password"
				mx={"xs"}
			/>
			<Button
				disabled={IsLoading || Username === "" || Password === ""}
				onClick={onClickAddAccount}
			>
				Add
			</Button>
		</Flex>
	);
}

export default MetaThreadsAddAccount;
