import { Dimensions, View, Text, Keyboard } from "react-native";
import { useEffect, useState } from "react";
import WebView from "react-native-webview";
import { StandardView } from "../../../../styles/Containers";
import { MainText } from "../../../../styles/Typography";
import { Button } from "@rneui/base";
import {
	MastodonService,
	RestClient,
	RestServices,
} from "@dhaaga/shared-provider-mastodon/dist";
import { AccountsRepo } from "../../../../libs/sqlite/repositories/accounts.repo";
import { CredentialsRepo } from "../../../../libs/sqlite/repositories/credentials.repo";
import uuid from "react-native-uuid";
import { verifyToken } from "@dhaaga/shared-provider-misskey/dist";
import AccountCreationPreview, {
	AccountCreationPreviewProps,
} from "../../../../components/app/AccountDisplay";

function MisskeySignInStack({ route, navigation }) {
	const [Session, setSession] = useState<string>("");
	const [PreviewCard, setPreviewCard] =
		useState<AccountCreationPreviewProps | null>(null);
	const [Token, setToken] = useState<string | null>(null);
	const [MisskeyId, setMisskeyId] = useState<string | null>(null);

	useEffect(() => {
		try {
			const regex = /^https:\/\/(.*?)\/miauth\/(.*?)\?.*?/;
			if (regex.test(route?.params?.signInUrl)) {
				const session = regex.exec(route?.params?.signInUrl)[2];
				setSession(session);
			}
		} catch (e) {
			setSession(uuid.v4() as unknown as string);
		}
	}, []);

	const [SessionConfirmed, setSessionConfirmed] = useState(false);
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
		const regex = /^https:\/\/example.com\/\?session=(.*?)/;
		if (regex.test(state.url)) {
			setSessionConfirmed(true);
			autoVerifyFromSession();
		}
	}

	async function autoVerifyFromSession() {
		const res = await verifyToken(subdomain, Session);
		if (res.ok) {
			setPreviewCard({
				displayName: res.user.name,
				username: res.user.username,
				avatar: res.user.avatarUrl,
			});
			setToken(res.token);
			setMisskeyId(res.user.id);
		}
	}

	async function onPressConfirm() {
		const accnt = await AccountsRepo.add({
			subdomain: subdomain,
			domain: "misskey",
			username: PreviewCard.username,
		});
		const creds = [
			{
				key: "display_name",
				value: PreviewCard.displayName,
			},
			{
				key: "avatar",
				value: PreviewCard.avatar,
			},
			{
				key: "misskey_id",
				value: MisskeyId,
			},
			{
				key: "access_token",
				value: Token,
			},
		];

		for (const cred of creds) {
			await CredentialsRepo.upsert(accnt, {
				credential_type: cred.key,
				credential_value: cred.value,
			});
		}
		navigation.navigate("Select an Account");
	}

	return (
		<View style={{ height: "100%" }}>
			{!SessionConfirmed && (
				<WebView
					style={{ flex: 1, minWidth: Dimensions.get("window").width - 20 }}
					source={{ uri: signInUrl }}
					onNavigationStateChange={callback}
				/>
			)}
			{!isKeyboardVisible && (
				<StandardView style={{ height: 160 }}>
					<MainText style={{ marginBottom: 12, marginTop: 16 }}>
						Step 2: Confirm your account
					</MainText>
					{PreviewCard && <AccountCreationPreview {...PreviewCard} />}
					{SessionConfirmed ? (
						<View>
							<Text style={{ marginBottom: 12, marginTop: 16 }}>
								Your session has been confirmed. Please confirm that you would
								like to add this account:
							</Text>
						</View>
					) : (
						<View></View>
					)}
					<Button disabled={!SessionConfirmed} onPress={onPressConfirm}>
						Confirm
					</Button>
				</StandardView>
			)}
		</View>
	);
}

export default MisskeySignInStack;
