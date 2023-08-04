import { useEffect, useState } from "react";
import {
	Keyboard,
	TouchableOpacity,
	View,
	Text,
	TextInput,
} from "react-native";
import { StandardView } from "../../../../styles/Containers";
import { MainText } from "../../../../styles/Typography";
import { Button } from "@rneui/base";
import { createCodeRequestUrl } from "@dhaaga/shared-provider-misskey/dist";

function MisskeyServerSelection({ navigation }) {
	const [isKeyboardVisible, setKeyboardVisible] = useState(false);
	const [InputText, setInputText] = useState("misskey.io");

	async function onPressNext() {
		const authUrl = await createCodeRequestUrl(`https://${InputText}`);
		const subdomain = `https://${InputText}`;
		navigation.navigate("Misskey Sign-In", { signInUrl: authUrl, subdomain });
	}

	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener(
			"keyboardDidShow",
			() => {
				setKeyboardVisible(true); // or some other action
			}
		);
		const keyboardDidHideListener = Keyboard.addListener(
			"keyboardDidHide",
			() => {
				setKeyboardVisible(false); // or some other action
			}
		);

		return () => {
			keyboardDidHideListener.remove();
			keyboardDidShowListener.remove();
		};
	}, []);

	const popularServers = [
		{ value: "misskey.io", label: "misskey.io" },
		{ value: "misskey.dev", label: "misskey.dev" },
		{ value: "misskey.id", label: " 🇮🇩misskey.id" },
		{ value: "hallsofamenti.io", label: "hallsofamenti.io" },
	];

	return (
		<StandardView
			style={{
				display: "flex",
				justifyContent: "space-between",
				height: "100%",
				marginTop: 16,
			}}
		>
			<View>
				{!isKeyboardVisible && (
					<View>
						<MainText style={{ marginBottom: 16 }}>
							Step 1: Select your server
						</MainText>

						<View style={{ flexDirection: "row", flexWrap: "wrap" }}>
							{popularServers.map((server, i) => (
								<TouchableOpacity
									key={i}
									onPress={() => {
										setInputText(server.value);
									}}
								>
									<View
										style={{
											padding: 8,
											margin: 4,
											backgroundColor: "lightblue",
											borderRadius: 4,
										}}
									>
										<Text>{server.label}</Text>
									</View>
								</TouchableOpacity>
							))}
						</View>
					</View>
				)}

				<MainText style={{ marginTop: 32, marginBottom: 12 }}>
					Or, enter it manually
				</MainText>
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
					}}
				>
					<Text style={{ fontSize: 16, color: "gray" }}>https://</Text>
					<TextInput
						style={{
							fontSize: 16,
							color: "blue",
							textDecorationLine: "underline",
						}}
						placeholder="misskey.io"
						defaultValue="misskey.io"
						onChangeText={setInputText}
						value={InputText}
					/>
					<Text style={{ fontSize: 16, color: "gray" }}>
						{"/miauth/{session}"}
					</Text>
				</View>
			</View>
			<View style={{ marginBottom: 32 }}>
				<Button style={{ width: 100, marginBottom: 32 }} onPress={onPressNext}>
					Next
				</Button>
			</View>
		</StandardView>
	);
}

export default MisskeyServerSelection;
