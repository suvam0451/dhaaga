import { Dimensions, View, Text, Keyboard } from "react-native";
import PasteTokenStep from "../../accounts-comp/PasteTokenStep";
import { useEffect, useState } from "react";
import WebView from "react-native-webview";
import { StandardView } from "../../../styles/Containers";
import { MainText } from "../../../styles/Typography";
import { Button } from "@rneui/base";
import {
	MastodonService,
	RestClient,
	RestServices,
} from "@dhaaga/shared-provider-mastodon/dist";
import { AccountsRepo } from "../../../libs/sqlite/repositories/accounts.repo";

function MastodonSignInStack({ route, navigation }) {
	const [Code, setCode] = useState<string | null>(null);

	const [isKeyboardVisible, setKeyboardVisible] = useState(false);

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

	const signInUrl = route?.params?.signInUrl || "https://mastodon.social";
	const subdomain = route?.params?.subdomain;

	function callback(state) {
		const regex = /^https:\/\/(.*?)\/oauth\/authorize\/native\?code=(.*?)$/;
		if (regex.test(state.url)) {
			const code = state.url.match(regex)[2];
			setCode(code);
		}
	}

	async function onPressConfirm() {
		const token = await MastodonService.getAccessToken(
			subdomain,
			Code,
			process.env.EXPO_PUBLIC_MASTODON_CLIENT_ID,
			process.env.EXPO_PUBLIC_MASTODON_CLIENT_SECRET
		);

		const client = new RestClient(subdomain, token);
		const verified =
			await RestServices.v1.default.accounts.default.verifyCredentials(client);

		AccountsRepo.add({
			subdomain: subdomain,
			domain: "mastodon",
			username: verified.username,
		});

		navigation.navigate("Select an Account");
	}

	return (
		<View style={{ height: "100%" }}>
			<WebView
				style={{ flex: 1, minWidth: Dimensions.get("window").width - 20 }}
				source={{ uri: signInUrl }}
				onNavigationStateChange={callback}
			/>
			{!isKeyboardVisible && (
				<StandardView style={{ height: 160 }}>
					<MainText style={{ marginBottom: 12, marginTop: 16 }}>
						Step 3: Confirm your account
					</MainText>
					{Code ? (
						<View>
							<Text style={{ marginBottom: 12 }}>
								A valid token was detected. Proceed with adding the account
								shown above?
							</Text>
						</View>
					) : (
						<View></View>
					)}
					<Button disabled={!Code} onPress={onPressConfirm}>
						Proceed
					</Button>
				</StandardView>
			)}
		</View>
	);
}

export default MastodonSignInStack;
